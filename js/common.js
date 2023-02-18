/**
 * ajax�̋��ʐݒ�
 */
$.ajaxSetup({
    beforeSend : function(xhr) {
        xhr.overrideMimeType('text/html;charset=Shift_JIS');
    }
});

/**
 * �{�[�h�̏���ێ�����N���X
 */
const board = new Board();

/**
 * onReady�̑O�Ɏ��s���鏈����o�^����
 */
const promises = [];
promises.push(board.loadSetting());
promises.push(board.loadThreadList());

/**
 * �y�[�W�̍\�����s���O�Ɏ��s���鏈����o�^����
 */
var onReady = async function() {}; // ���D�݂ɃI�[�o�[���C�h����

/**
 * �y�[�W�̍\����Ɏ��s���鏈����o�^����
 */
var onLoad = async function() {}; // ���D�݂ɃI�[�o�[���C�h����

/**
 * ���C���̏���
 */
$(async function() {
    Promise.all(promises).then(async function() {
        // �y�[�W�̍\��
        $("#nav-title").text(board.setting["BBS_TITLE"]);
        $("title").text(board.setting["BBS_TITLE"]);
        await onReady();
        
        // �y�[�W�̍\����̏���
        $(".default-hidden").show();
        $(".default-show").hide();
        await onLoad();
    })
});

/**
 * �E�B���h�E�ŏ㕔�փX�N���[������
 */
function scrollToTop() {
    $('html, body').scrollTop(0);
}

/**
 * �E�B���h�E�ŉ����փX�N���[������
 */
function scrollToBottom() {
    $('html, body').scrollTop($(document).height());
}

/**
 * �G���[�̏o�͂��s���A���̌�]���ł֑J�ڂ��܂��B
 * @param {*} msg ���[�U�[�ɒʒm���郁�b�Z�[�W
 * @param {*} jqXHR 
 * @param {*} textStatus 
 * @param {*} errorThrown 
 */
function error(msg, jqXHR, textStatus, errorThrown) {
    // ���[�U�[�ɃG���[���e��ʒm
    console.error('�G���[���������܂����B', jqXHR);

    msg += "\n\n------------------------------------------\n" + textStatus + ' : ' + errorThrown;
    alert(msg);

    // �]���ł֔��
    const answer = confirm("�]���łɈړ����܂��B\n��낵���ł����H");
    if(answer) {
        location.href = "../";
        throw new Error(); // ���ꂪ�Ȃ��ƑJ�ڑO�Ɏc�A������邩��
    }
}