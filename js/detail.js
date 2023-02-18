const fileName = new URL(window.location.href).searchParams.get("file");

main = async function() {
    var thread = board.threadList[fileName];
    if(!thread) thread = Object.entries(board.threadList)[0][1]; // 引数が間違ってたら一個目を使う

    // サイドバーの初期化
    $("#side-bar").append(board.toHTML(fileName));
    await thread.load();
    $("#response-list").append(thread.toHTML());
    loadScroll();

    $(window).scroll(function() {
        saveScroll();
    });

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

function convertPathUrl( src ) {
    return $("<a>").attr("href", src).get(0).href;
}