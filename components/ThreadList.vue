<template>
    <div v-for="thread in threadList" :key="threadList">
        <router-link to="/thread" class="border-bottom p-2">
            <div class="frex-row d-flex text-secondary" style="font-size: 3px;">
                <div>{{ thread.dateTime.getFullYear() + "/" + ('0' + (thread.dateTime.getMonth() + 1)).slice(-2) + "/" + ('0' + thread.dateTime.getDate()).slice(-2) + " " + ('0' + thread.dateTime.getHours()).slice(-2) + ":" + ('0' + thread.dateTime.getMinutes()).slice(-2) }}</div>
            </div>
            <div class="row ps-2">
                <div class="col-10">
                    <div class="text-truncate title" v-html="thread.title"></div>
                </div>
                <div class="col-2 text-center">
                    <span>{{ thread.count }}</span>
                </div>
            </div>
        </router-link>
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
                await BOARD.loadThreadList();
                this.threadList = BOARD.threadList;
            },
        },
        /* 以下はVue-Routerのライフサイクルによって適宜呼び出されるコールバック関数です。 */
        // インスタンスが生成されたときに実行される
        created() {
            this.fetchThreadList();
        },
    }
</script>