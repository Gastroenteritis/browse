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
        <p class="h3 p-2">{{ title }}</p>
        <div v-for="response in responseList" class="border-bottom">
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
        <div class="sticky-md-bottom w-100 bg-light p-3">
            <form method="POST" action="../../test/bbs.cgi" class="container-fluid" id="post-form">
                <input type="hidden" name="key" v-bind:value="datNum"/>
                <input type="hidden" name="bbs" v-bind:value="bbsName"/>
                <div class="row row-cols-auto">
                    <div class="col mb-2">
                        <label for="FROM" style="width: 3rem;">名前</label>
                        <input type="text" v-model="name" class="rounded post-input" name="FROM"/>
                    </div>
                    <div class="col mb-2">
                        <label for="mail" style="width: 3rem;">メール</label>
                        <input type="mail" v-model="mail" class="rounded post-input" autocomplete="off" name="mail"/>           
                    </div>
                </div>
                <div class="row mb-2">
                    <textarea class="rounded w-100 post-input" style="resize:none;" rows="3" name="MESSAGE" v-model="message"></textarea>
                </div>
                <div class="row">
                    <button v-on:click="$loading(write)" type="button" class="w-100 btn btn-primary post-input" id="post-button">投稿</button>
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
                bbsName: this.$board.getBBSName(),
                fileName: "",
                datNum: "",
                name: "",
                mail: "",
                message: "",
            }
        },
        methods: {
            /**
             * ページ遷移時の処理まとめ
             */
            init: async function(){
                $("#errorModal").modal("hide");

                // スレッドを取得
                this.fileName = this.$route.params.fileName;
                this.thread = this.$board.getThread(this.fileName);
                if(!this.thread) {
                    // １回目ならスレッドリストを再取得してもう一回やってみる
                    await this.$board.manualReload();
                    this.thread = this.$board.getThread(this.fileName);

                    // それでも無いなら404
                    if(!this.thread) {
                        this.$router.push({name: '404'});
                    }
                }
                // レスを取得
                await this.thread.load();

                // 細かいのを初期化
                // this.initShortCut(); // ショートカットの初期化
                this.message = "";
                this.title = this.thread.title;
                this.datNum = this.thread.getKey();
                this.responseList = this.thread.responseList;
                this.name = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)NAME\s*\=\s*([^;]*).*$)|^.*$/, "$1").replace(/"/g, ""));
                this.mail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)MAIL\s*\=\s*([^;]*).*$)|^.*$/, "$1").replace(/"/g, ""));

                this.$toggleLoading(false);
            },
            /**
             *  も り あ が っ て き た
             */
            write: async function() {
                const self = this;
                const thread = self.thread; // 途中でthreadが変わったら実行しないようにするために変数に入れておく
                var errorTitle = '';
                var errorMessage = '';
                var error = null;
                var response = null;

                await thread.write($("#post-form")).then(function(res, status, xhr) {
                    response = res;
                    // 書き込み成功
                    if(response.match(/<meta http-equiv="Refresh(.*)">/)) {
                        console.log("書き込み成功");
                        self.message="";
                    }
                    // 書き込み失敗その１
                    else {
                        error = response;
                        errorTitle = "書き込み失敗";
                        errorMessage = response.replace(/<div class="reload">(.*)<\/div>/, ""); // 従来版へ遷移するリンクが存在すれば削除
                    }
                }).catch(function(data, status, xhr){
                    error = data;
                    if(status === 404) {
                        errorTitle = "404 Not Found";
                        errorMessage = "スレッドが見つかりませんでした。";
                    } else if(status === 0) {
                        errorTitle = "接続エラー";
                        errorMessage = "サーバーに接続できませんでした。";
                    } else {
                        errorTitle = "エラー";
                        errorMessage = "不明なエラーが発生しました。";
                    }
                }).always(function() {
                    if(error) {
                        if(thread === self.thread) {
                            self.showErrorModal(errorTitle, errorMessage);
                        }
                        return;
                    }
                    // 書き込み欄までスクロール
                    $("#post-form").get(0).scrollIntoView();
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
            },
            /**
             * Shift+Enterで書き込みをフック
             */
            initShortCut: function() {
                const self = this;
                $(document).on("keydown", function(e) {
                    if(e.shiftKey && e.keyCode === 13) {
                        $("#post-button").click();
                    }
                });
            },
        },
        beforeRouteEnter(to, from, next) {
            next(vm => vm.init());
        },
        watch: {
            $route(to, from) {
                this.init();
            }
        },
    }
</script>