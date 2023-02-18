/**
 * ajaxの共通設定
 */
$.ajaxSetup({
    beforeSend : function(xhr) {
        xhr.overrideMimeType('text/html;charset=Shift_JIS');
    }
});

/**
 * ボードの情報を保持するクラス
 */
const board = new Board();

/**
 * onReadyの前に実行する処理を登録する
 */
const promises = [];
promises.push(board.loadSetting());
promises.push(board.loadThreadList());

/**
 * ページの構成を行う前に実行する処理を登録する
 */
var onReady = async function() {}; // お好みにオーバーライドする

/**
 * ページの構成後に実行する処理を登録する
 */
var onLoad = async function() {}; // お好みにオーバーライドする

/**
 * メインの処理
 */
$(async function() {
    Promise.all(promises).then(async function() {
        // ページの構成
        $("#nav-title").text(board.setting["BBS_TITLE"]);
        $("title").text(board.setting["BBS_TITLE"]);
        await onReady();
        
        // ページの構成後の処理
        $(".default-hidden").show();
        $(".default-show").hide();
        await onLoad();
    })
});

/**
 * ウィンドウ最上部へスクロールする
 */
function scrollToTop() {
    $('html, body').scrollTop(0);
}

/**
 * ウィンドウ最下部へスクロールする
 */
function scrollToBottom() {
    $('html, body').scrollTop($(document).height());
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