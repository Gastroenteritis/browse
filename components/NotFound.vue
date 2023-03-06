<template>
    <div class="container">
        <div class="row">
            <div class="text-center">
                <h1 class="m-3">404 NotFound!</h1>
                <p>ページが見つかりませんでした・・・</p>
            </div>
        </div>
    </div>
</template>
<script>
    module.exports = {
        mounted: function() {
            appLoadEnd();
        },
        beforeRouteLeave (to, from, next) {
            appLoadStart();
            next();
        },
    }
</script>
<style>
</style>