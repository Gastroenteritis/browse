// ���X�Ǝ󂯌p������
$.ajaxSetup({
    beforeSend : function(xhr) {
        xhr.overrideMimeType('text/html;charset=Shift_JIS');
    }
});


// ���
const board = new Board();
const promises = [];
promises.push(board.loadSetting());
promises.push(board.loadThreadList());
var main = function() {}; // ���D�݂ɃI�[�o�[���C�h����

$(function() {
    Promise.all(promises).then(values => {
        $("#nav-title").text(board.setting["BBS_TITLE"]);
        $("title").text(board.setting["BBS_TITLE"]);
        main();
        $(".default-hidden").show(); // �ς��Ɛ؂�ւ�����������������
        $(".default-show").hide();

        // �X�N���[���ɂ��v�f�̐���
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
 * saveScroll()�ŕۑ������I�u�W�F�N�g�����o���A�f�V���A���C�Y�����̂��A
 * ���݂�URL������̂��̂ł���Ȃ�X�N���[�������s���܂��B
 */
function loadScroll() {
    // �X�N���[���ʒu���Č�
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
 * ���݂̃X�N���[���ʒu��URL���������I�u�W�F�N�g���V���A���C�Y���ăZ�b�V�����X�g���[�W�ɕۑ����܂��B
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