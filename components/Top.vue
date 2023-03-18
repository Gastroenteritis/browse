<template>
    <!-- メインコンテンツ -->
    <div class="text-center w-100 p-5">
        <p>トップページ</p>
        <h1 class="fw-bold">工事中</h1>
        <img src="./img/ojigi_animal_inu.png" style="height:200px; width: auto"/>
        <p>
            ご迷惑をおかけします
            <br>
            ご協力の程
            <br>
            よろしくお願い致します
        </p>
    </div>
</template>
<script>
    module.exports = {
        mounted() {
            this.$toggleLoading(false);
        },
    }
</script>