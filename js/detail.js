// パラメーターの受け取り
const fileName = new URL(window.location.href).searchParams.get("file");

/**
 * ページの初期化
 */
onReady = async function() {
    var thread = board.threadList[fileName];
    if(!thread) thread = Object.entries(board.threadList)[0][1]; // 引数が間違ってたら一個目を使う

    // サイドバーの初期化
    $("#side-bar").append(board.toHTML(fileName));
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
    $("button#post-button").click(function() {
        thread.write($form).fail(function() {
            $(".post-input").prop('disabled', false);
        });
        $(".post-input").prop('disabled', true);
    });

    // クッキーモンスター
    const cookies = getCookieArray();
    $("input[name='mail']").val(cookies['MAIL']);
    $("input[name='FROM']").val(cookies['NAME']);
}

/**
 * ページの読み込み完了時に呼び出される。
 */
onLoad = async function() {
    // ページをスクロール
    loadScroll();

    // スクロール位置の記憶を定義
    $(window).scroll(function() {
        saveScroll();
    });

    // スクロールによる要素の制御
    initScrollButtonControll();
}

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