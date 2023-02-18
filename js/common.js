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
        initScrollButtonControll();
    })
});

/**
 * �X�N���[���{�^���̐�����`����B
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
        // "�g�b�v��"�{�^���̐���
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
        // "�ŉ�����"�{�^���̐���
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
    $('html, body').animate({ scrollTop: 0 }, 'fast');
}

function scrollToBottom() {
    $('html, body').animate({ scrollTop: $(document).height() }, 'fast');
}

/**
 * �L�����ꂽ�X�N���[���ʒu�𕜌����܂��B
 * �������A���݂�URL�ƋL�����ꂽURL����v���Ȃ��ꍇ�͕������܂���B
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
 * ���݂̃X�N���[���ʒu���L�����܂��B
 * ���݂�URL�ƃX�N���[���ʒu��JSON�`���ŃZ�b�V�����X�g���[�W�ɕۑ����܂��B
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