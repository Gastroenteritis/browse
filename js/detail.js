// パラメーターの受け取り
const fileName = new URL(window.location.href).searchParams.get("file");
var thread = null;
/**
 * ページの初期化
 */
onReady = async function() {
    thread = board.threadList[fileName];
    if(!thread) {
        thread = Object.entries(board.threadList)[0][1];
    }

    // サイドバーの初期化
    $("#side-bar").append(board.toHTML(fileName));

    // スレたいの初期化
    $("#thread-title").text(thread.title);

    // レスポンスリストの初期化
    await thread.load();
    $("#response-list").append(thread.toHTML());

    // 送信フォームの初期化
    const $form = $("form#post-form");
    $form.append($("<input/>", {
        type: "hidden",
        name: "bbs",
        value: thread.getBBSName(),
    }));
    $form.append($("<input/>", {
        type: "hidden",
        name: "key",
        value: thread.getKey(),
    }));
    // 送信ボタンの初期化
    $button = $("button#post-button");
    $button.click(function() {
        thread.write($form).fail(function() {
            $(".post-input").prop('disabled', false);
        });
        $(".post-input").prop('disabled', true);
    });

    // クッキーモンスター
    const cookies = getCookieArray();
    $("input[name='mail']").val(cookies['MAIL']);
    $("input[name='FROM']").val(cookies['NAME']);

    // フォームポストのショートカットを定義
    $(window).keydown(function(e){
        if(e.shiftKey){
            if(e.keyCode === 13){
                $button.click();
            }
        }
    });
}

/**
 * 非同期でページの再読み込みを行う。
 */
async function asyncReload() {
    let nowLength = thread.responseList.length;
    await thread.load();
    if(thread.isReset) {
        $("#response-list").empty();
        nowLength = 0;
        await thread.load();
    }
    for(var i=nowLength; i<thread.responseList.length; i++) {
        $("#response-list").append(thread.responseList[i].toHTML());
        loadScroll();
    }

    setTimeout(asyncReload, 3000); // 再起的ループ
}

/**
 * ページの読み込み完了時に呼び出される。
 */
onLoad = async function() {
    // スクロールボタンの制御を定義
    initScrollButtonControll();

    // ページをスクロール
    loadScroll();

    // スクロール位置の記憶開始
    $(window).scroll(function() {
        saveScroll();
    });

    asyncReload();
}

/**
 * スクロールボタンの制御を定義する。
 */
function initScrollButtonControll() {
    // 初期化
    const $document = $(document);
    const $window = $(window);
    let showTopButton = false;
    let showBottomButton = true;
    const $topButton = $(".topButton");
    const $bottomButton = $(".bottomButton");
    const topButtonHeight = 200;
    const bottomButtonHeight = 200;
    $topButton.click(scrollToTop);
    $bottomButton.click(scrollToBottom);

    // 初期値の設定
    $topButton.hide();
    if($document.height() - $window.height() - $window.scrollTop() <= bottomButtonHeight) {
        $bottomButton.hide();
        showBottomButton = false;
    }

    // ボタン制御を定義
    $(window).scroll(function () {
        // "トップへ"ボタンの制御
        if ($window.scrollTop() > topButtonHeight) {
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
        if ($document.height() - $window.height() - $window.scrollTop() > bottomButtonHeight) {
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
 * クッキーの値を取得する。
 * @returns クッキーの連装配列を返します。
 */
function getCookieArray(){
    var arr = new Array();
    if(document.cookie != ''){
      var tmp = document.cookie.split('; ');
      for(var i=0;i<tmp.length;i++){
        var data = tmp[i].split('=');
        arr[data[0]] = $("<div></div>").html(decodeURIComponent(data[1].replaceAll("\"", ""))).text();
      }
    }
    return arr;
}

/**
 * 相対パスを絶対パスに変換します。
 * @param {string} src 変換する相対パス 
 * @returns 
 */
function convertPathUrl( src ) {
    return $("<a>").attr("href", src).get(0).href;
}