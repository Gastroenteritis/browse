// 脈々と受け継がれる呪い
$.ajaxSetup({
    beforeSend : function(xhr) {
        xhr.overrideMimeType('text/html;charset=Shift_JIS');
    }
});


// 主役
const board = new Board();
const promises = [];
promises.push(board.loadSetting());
promises.push(board.loadThreadList());
var main = function() {}; // お好みにオーバーライドする

$(function() {
    Promise.all(promises).then(values => {
        $("#nav-title").text(board.setting["BBS_TITLE"]);
        $("title").text(board.setting["BBS_TITLE"]);
        main();
        $(".default-hidden").show(); // ぱっと切り替えた方がかっこいい
        $(".default-show").hide();

        // スクロールによる要素の制御
        let showFlgBottom = false;
        let showFlgTop = false;
        const $showBottomButton = $(".showBottomButton");
        const $showTopButton = $(".showTopButton");
        if($showBottomButton || $showBottmtop) {
            $(window).scroll(function () {
                if ($(window).scrollTop() > 200) {
                    if (showFlgBottom == false) {
                        showFlgBottom = true;
                        $showBottomButton.show();
                    }
                } else {
                    if (showFlgBottom) {
                        showFlgBottom = false;
                        $showBottomButton.hide();
                    }
                }
                console.log(showFlgTop)

                if ($(window).scrollTop() < 200) {
                    if (showFlgTop == false) {
                        showFlgTop = true;
                        $showTopButton.show();
                    }
                } else {
                    if (showFlgTop) {
                        showFlgTop = false;
                        $showTopButton.hide();
                    }
                }
            });
        }
    })
});

/**
 * saveScroll()で保存したオブジェクトを取り出し、デシリアライズしたのち、
 * 現在のURLが同一のものであるならスクロールを実行します。
 */
function loadScroll() {
    // スクロール位置を再現
    var obj = sessionStorage.getItem("LASTPOSITION");
    obj = JSON.parse(obj);
    console.log(obj);
    if(obj !== null && obj.url !== null && obj.position !== null) {
        if(location.href == obj.url) {
            window.scrollTo(0, obj.position);
        }
    }
}

/**
 * 現在のスクロール位置とURLを持ったオブジェクトをシリアライズしてセッションストレージに保存します。
 */
function saveScroll() {
    sessionStorage.setItem("LASTPOSITION", JSON.stringify({
        url: location.href,
        position: window.scrollY
    }));
}

function getScrollBottom() {
    var body = window.document.body;
    var html = window.document.documentElement;
    var scrollTop = body.scrollTop || html.scrollTop;
    return html.scrollHeight - html.clientHeight - scrollTop;
}


/**
 * エラーの出力を行い、その後従来版へ遷移します。
 * @param {*} msg ユーザーに通知するメッセージ
 * @param {*} jqXHR 
 * @param {*} textStatus 
 * @param {*} errorThrown 
 */
function error(msg, jqXHR, textStatus, errorThrown) {
    // ユーザーにエラー内容を通知
    console.error('エラーが発生しました。', jqXHR);

    msg += "\n\n------------------------------------------\n" + textStatus + ' : ' + errorThrown;
    alert(msg);

    // 従来版へ避難
    const answer = confirm("従来版に移動します。\nよろしいですか？");
    if(answer) {
        location.href = "../";
        throw new Error(); // これがないと遷移前に残尿が垂れるかも
    }
}