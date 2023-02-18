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
var main = async function() {}; // お好みにオーバーライドする

$(async function() {
    Promise.all(promises).then(async function() {
        $("#nav-title").text(board.setting["BBS_TITLE"]);
        $("title").text(board.setting["BBS_TITLE"]);
        await main();
        $(".default-hidden").show(); // ぱっと切り替えた方がかっこいい
        $(".default-show").hide();

        // スクロールによる要素の制御
        initScrollButtonControll();
    })
});

/**
 * スクロールボタンの制御を定義する。
 */
function initScrollButtonControll() {
    const $document = $(document);
    const $window = $(window);
    let showTopButton = false;
    let showBottomButton = false;
    const $topButton = $(".topButton");
    const $bottomButton = $(".bottomButton");
    $topButton.click(scrollToTop);
    $topButton.hide();
    $bottomButton.click(scrollToBottom);
    $bottomButton.hide();

    $(window).scroll(function () {
        // "トップへ"ボタンの制御
        if ($window.scrollTop() > 200) {
            if (showTopButton == false) {
                showTopButton = true;
                $topButton.show();
            }
        } else {
            if (showTopButton) {
                showTopButton = false;
                $topButton.hide();
            }
        }
        // "最下部へ"ボタンの制御
        if ($document.height() - $window.height() - $window.scrollTop() > 200) {
            if (showBottomButton == false) {
                showBottomButton = true;
                $bottomButton.show();
            }
        } else {
            if (showBottomButton) {
                showBottomButton = false;
                $bottomButton.hide();
            }
        }
    });
}

function scrollToTop() {
    $('html, body').scrollTop(0);
}

function scrollToBottom() {
    $('html, body').scrollTop($(document).height());
}

/**
 * 記憶されたスクロール位置を復元します。
 * ただし、現在のURLと記憶されたURLが一致しない場合は復元しません。
 */
function loadScroll() {
    const $document = $(document);
    const $window = $(window);
    var obj = sessionStorage.getItem("LASTPOSITION");
    obj = JSON.parse(obj);

    if(obj !== null && obj.url !== null && obj.position !== null) {
        if(location.href == obj.url) {
            $window.scrollTop($document.height() - $window.height() - obj.position);
        }
    }
}

/**
 * 現在のスクロール位置を記憶します。
 * 現在のURLとスクロール位置をJSON形式でセッションストレージに保存します。
 */
function saveScroll() {
    const $document = $(document);
    const $window = $(window);

    sessionStorage.setItem("LASTPOSITION", JSON.stringify({
        url: location.href,
        position: $document.height() - $window.height() - $window.scrollTop()
    }));
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