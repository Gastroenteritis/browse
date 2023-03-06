<template>
    <!-- エラーメッセージ表示用のモーダル -->
    <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">書き込みに失敗しました</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- ここに内容を上書きします。 -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
                </div>
            </div>
        </div>
    </div>

    <div class="p-2 pb-0">
        <p class="h3 m-2">{{ title }}</p>
        <div v-for="response in responseList" :key="response" class="border-bottom">
            <div class="d-flex" style="font-size: 13px;">
                <div class="fw-bold me-2">{{ response.count }}</div>
                <div v-html="response.name" class="text-success"></div>
            </div>
            <div class="d-flex">
                <div class="me-2"></div>
                <div v-html="response.message" class="text-break"></div>
            </div>
            <br>
            <br>
            <div class="d-flex text-secondary" style="font-size: 3px;">
                <div class="me-auto">{{ response.dateTime }}</div>
                <div>{{ response.id }}</div>
            </div>
        </div>
        <!--書き込み欄-->
        <div v-if="thread" class="sticky-md-bottom w-100 bg-light p-3">
            <form method="POST" action="../../test/bbs.cgi" class="container-fluid" id="post-form">
                <input type="hidden" name="key" v-bind:value="datNum"/>
                <input type="hidden" name="bbs" v-bind:value="bbsName"/>
                <div class="row row-cols-auto">
                    <div class="col mb-2">
                        <label for="FROM" style="width: 3rem;">名前</label>
                        <input type="text" v-bind:value="name" class="rounded post-input" name="FROM"/>
                    </div>
                    <div class="col mb-2">
                        <label for="mail" style="width: 3rem;">メール</label>
                        <input type="mail" v-bind:value="mail" class="rounded post-input" autocomplete="off" name="mail"/>           
                    </div>
                </div>
                <div class="row mb-2">
                    <textarea class="rounded w-100 post-input" style="resize:none;" rows="3" name="MESSAGE" v-model="message"></textarea>
                </div>
                <div class="row">
                    <button v-on:click="write()" type="button" class="w-100 btn btn-primary post-input" id="post-button">投稿</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
    module.exports = {
        data() {
            return {
                thread: null,
                title: 'ロード中',
                responseList: [],
                bbsName: BOARD.getBBSName(),
                fileName: "",
                datNum: "",
                name: "",
                mail: "",
                message: "",
            }
        },
        props: {
            setLoading: {
                type: Function,
                default: () => {}
            }
        },
        methods: {
            /**
             * ページ遷移時の処理まとめ
             */
            init: async function(){
                this.setLoading(true);
                $("#errorModal").modal("hide");

                // スレッドを取得
                this.fileName = this.$route.params.fileName;
                this.thread = BOARD.threadList[this.fileName];
                if(!this.thread) {
                    // １回目ならスレッドリストを再取得してもう一回やってみる
                    await BOARD.loadThreadList();
                    this.thread = BOARD.threadList[this.fileName];

                    // それでも無いなら404
                    if(!this.thread) {
                        this.$router.push({name: '404'});
                    }
                }
                // レスを取得
                await this.thread.load();

                // 細かいのを初期化
                this.message = "";
                this.title = this.thread.title;
                this.datNum = this.thread.getKey();
                this.responseList = this.thread.responseList;
                this.name = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)NAME\s*\=\s*([^;]*).*$)|^.*$/, "$1").replace(/"/g, ""));
                this.mail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)MAIL\s*\=\s*([^;]*).*$)|^.*$/, "$1").replace(/"/g, ""));

                this.setLoading(false);
            },
            /**
             *  も り あ が っ て き た
             */
            write: function() {
                const self = this;
                self.setLoading(true);
                const thread = self.thread; // 途中でthreadが変わったら実行しないようにするために変数に入れておく
                thread.write($("#post-form")).then(function(data, textStatus, jqXHR) {
                    // dataの中でmetaタグでリダイレクト先が指定されていれば書き込み成功
                    if(data.match(/<meta http-equiv="Refresh(.*)">/)) {
                        console.log("書き込み成功", jqXHR);
                        self.message="";
                    } 
                    // 書き込み失敗
                    else {
                        console.log("書き込み失敗", jqXHR);
                        data = data.replace(/<div class="reload">(.*)<\/div>/, "");
                        
                        // 同じページっぽかったらモーダルを表示
                        if(thread === self.thread) {
                            self.showErrorModal("書き込みに失敗しました", data);
                        }
                    }
                }).catch(function(jqXHR, textStatus, errorThrown) {
                    let title = '';
                    let message = '';
                    if(jqXHR.status === 404) {
                        title = "404 Not Found";
                        message = "スレッドが見つかりませんでした。";
                    } else if(jqXHR.status === 0) {
                        title = "接続エラー";
                        message = "サーバーに接続できませんでした。";
                    } else {
                        title = "エラー";
                        message = "不明なエラーが発生しました。";
                    }
                    if(thread === self.thread) {
                        self.showErrorModal(title, message);
                    }
                }).always(function() {
                    // 書き込み処理中にスレッドを切り替えていた場合ここでは何もしない
                    if(thread === self.thread) {
                        self.setLoading(false);
                    }
                });
            },
            /**
             * メッセージモーダルを表示
             * @param {*} title 
             * @param {*} message 
             */
            showErrorModal: function(title, message) {
                $("#errorModal .modal-title").html(title);
                $("#errorModal .modal-body").html(message);
                $("#errorModal").modal("show");
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => vm.init());
        },
        beforeRouteLeave(to, from, next) {
            this.setLoading(true);
            next();
        },
        watch: {
            $route(to, from) {
                this.init();
            }
        },
    }
</script>