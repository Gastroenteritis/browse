// Ajaxの共通設定
$.ajaxSetup({
    beforeSend : function(xhr) {
        xhr.overrideMimeType('text/html;charset=Shift_JIS');
    }
});

const BOARD = new Board();
const promises = BOARD.load();

(function() {
    'use strict';

    $(function() {
        Promise.all(promises).then(function() {
            const bbsTitle = BOARD.setting["BBS_TITLE"];
            $("title").text(bbsTitle);
            $('#nav-title').text(bbsTitle);

            build();
        });
    })
})();

function build() {
    const routes = [
        { path: '/', component: httpVueLoader('./pages/Index.vue')},
        { path: '/thread/:fileName', component: httpVueLoader('./pages/Thread.vue')},
        { path: '*', component: httpVueLoader('./pages/NotFound.vue')},
    ];

    const router = new VueRouter({
        routes
    });

    new Vue({
        el: '#app',
        router: router,
    });
}