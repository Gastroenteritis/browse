// �p�����[�^�[�̎󂯎��
const fileName = new URL(window.location.href).searchParams.get("file");
var thread = null;
/**
 * �y�[�W�̏�����
 */
onReady = async function() {
    thread = board.threadList[fileName];
    if(!thread) {
        thread = Object.entries(board.threadList)[0][1];
    }

    // �T�C�h�o�[�̏�����
    $("#side-bar").append(board.toHTML(fileName));

    // �X�������̏�����
    $("#thread-title").text(thread.title);

    // ���X�|���X���X�g�̏�����
    await thread.load();
    $("#response-list").append(thread.toHTML());

    // ���M�t�H�[���̏�����
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
    // ���M�{�^���̏�����
    $button = $("button#post-button");
    $button.click(function() {
        thread.write($form).fail(function() {
            $(".post-input").prop('disabled', false);
        });
        $(".post-input").prop('disabled', true);
    });

    // �N�b�L�[�����X�^�[
    const cookies = getCookieArray();
    $("input[name='mail']").val(cookies['MAIL']);
    $("input[name='FROM']").val(cookies['NAME']);

    // �t�H�[���|�X�g�̃V���[�g�J�b�g���`
    $(window).keydown(function(e){
        if(e.shiftKey){
            if(e.keyCode === 13){
                $button.click();
            }
        }
    });
}

/**
 * �񓯊��Ńy�[�W�̍ēǂݍ��݂��s���B
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

    setTimeout(asyncReload, 3000); // �ċN�I���[�v
}

/**
 * �y�[�W�̓ǂݍ��݊������ɌĂяo�����B
 */
onLoad = async function() {
    // �X�N���[���{�^���̐�����`
    initScrollButtonControll();

    // �y�[�W���X�N���[��
    loadScroll();

    // �X�N���[���ʒu�̋L���J�n
    $(window).scroll(function() {
        saveScroll();
    });

    asyncReload();
}

/**
 * �X�N���[���{�^���̐�����`����B
 */
function initScrollButtonControll() {
    // ������
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

    // �����l�̐ݒ�
    $topButton.hide();
    if($document.height() - $window.height() - $window.scrollTop() <= bottomButtonHeight) {
        $bottomButton.hide();
        showBottomButton = false;
    }

    // �{�^��������`
    $(window).scroll(function () {
        // "�g�b�v��"�{�^���̐���
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
        // "�ŉ�����"�{�^���̐���
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
 * �N�b�L�[�̒l���擾����B
 * @returns �N�b�L�[�̘A���z���Ԃ��܂��B
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
 * ���΃p�X���΃p�X�ɕϊ����܂��B
 * @param {string} src �ϊ����鑊�΃p�X 
 * @returns 
 */
function convertPathUrl( src ) {
    return $("<a>").attr("href", src).get(0).href;
}