<template>
<!-- サイドバー　-->
<div>
    <div v-for="thread in $board.threadList">
        <router-link :to="{ name: 'thread', params: { fileName: thread.fileName } }">
            <div class="border-bottom p-1">
                <div class="frex-row d-flex text-secondary" style="font-size: 3px;">
                    <div>{{ thread.dateTime.getFullYear() + "/" + ('0' + (thread.dateTime.getMonth() + 1)).slice(-2) + "/" + ('0' + thread.dateTime.getDate()).slice(-2) + " " + ('0' + thread.dateTime.getHours()).slice(-2) + ":" + ('0' + thread.dateTime.getMinutes()).slice(-2) }}</div>
                </div>
                <div class="row ps-2">
                    <div class="col-10">
                        <div class="text-truncate title" v-bind:title="$htmlDecode(thread.title)" v-html="thread.title"></div>
                    </div>
                    <div class="col-2 text-center">
                        <span>{{ thread.count }}</span>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</div>
</template>
<script>
    module.exports = {
        // このページで使うデータを定義
        data: function() {
            return {
                threadList: {},
            }
        },
        // このページで使うメソッドを定義
        methods: {
            fetchThreadList: async function() {
                await this.$board.loadThreadList();
                this.threadList = this.$board.threadList;
            },
        },
        /* 以下はVue-Routerのライフサイクルによって適宜呼び出されるコールバック関数です。 */
        // インスタンスが生成されたときに実行される
        created() {
            this.fetchThreadList();
        },
        mounted() {
            this.$showSideBarFlag = false;
            this.$toggleLoading(false);
        },
        // ページから離脱時に実行される
        beforeRouteLeave(to, from, next) {
            this.$showSideBarFlag = true;
            next();
        },
    }
</script>