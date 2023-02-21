/**
 * ������ShiftJIS�ɕϊ��ł��邩�ǂ����𔻒肵�܂��B
 * @param {string} str �e�L�X�g
 */
isShiftJIS = function(str) {
    // �p����
    if (str.match(/^[0-9A-Za-z]+$/)) {
        return true;
    }
    // ���p�J�i
    if (str.match(/^[�-�]+$/)) {
        return true;
    }
    // ���p�L��
    if (str.match(/^[!-\/:-@[-`{-~]+$/)) {
        return true;
    }
    // ���p�X�y�[�X
    if (str.match(/^[\s]+$/)) {
        return true;
    }
    // �S�p����
    if (str.match(/^[��-��@-���[��-ꞁX�Y?]+$/)) {
        return true;
    }
    // �S�p�L��
    if (str.match(/^[�I-�^�F-���m-�M�o-�`]+$/)) {
        return true;
    }
    // �S�p�X�y�[�X
    if (str.match(/^[\u3000]+$/)) {
        return true;
    }
    // ����ȊO
    return false;
}

/**
 * �������SJIS�ɕϊ�����URL�G���R�[�h����
 * @param {string} str ������
 */
sjisUrlEncodeForHtml = function(str) {
    // �����R�[�h�̔z��ɕϊ�
    const unicodeArray = [];
    for (let i = 0; i < str.length; i++) {
        // �����R�[�h�ɕϊ�
        var code = str.charCodeAt(i);
        
        // ShiftJIS�ɕϊ��ł��镶���Ȃ�
        if (isShiftJIS(str.charAt(i))) {
            unicodeArray.push(code);
        } 
        // ShiftJIS�ɕϊ��ł��Ȃ�������HTMLEntity�ɕϊ�����
        else {
            // �T���Q�[�g�y�A�̏ꍇ�͂Q���������P�����Ƃ��Ĉ���
            if (0xd800 <= code && code <= 0xdbff) {
                const code2 = str.charCodeAt(i + 1);
                if (0xdc00 <= code2 && code2 <= 0xdfff) {
                    i++;
                    code = ((code - 0xd800) << 10) + (code2 - 0xdc00) + 0x10000;
                }
            }
            // HTML�G���e�B�e�B�ɕϊ�
            const entity = "&#" + code + ";";
            // entity���P�����������R�[�h�ɕϊ����Ĕz��ɒǉ�
            for (let j = 0; j < entity.length; j++) {
                unicodeArray.push(entity.charCodeAt(j));
            }
        }
    }

    // SJINS�ɕϊ�
    const sjisBytes = Encoding.convert(unicodeArray, {
        to: 'SJIS',
        from: 'UNICODE',
    });
    // URL�G���R�[�h����
	return Encoding.urlEncode(sjisBytes);
};

class User {
    id;
    count;
    responseList;

    constructor(id) {
        this.id = id;
        this.responseList = [];
        count = 0;
    }

    /**
     * ���X�|���X��ǉ����܂��B
     */
    addResponse(response) {
        this.responseList.push(response);
        count++;
    }

    /**
     * ���̃C���X�^���X�̓��e��HTML�v�f�ɕϊ����܂��B
     * @returns {jQuery} �ϊ����HTML�v�f
     */
    toHTML() {
        const $html = $("<div/>", {
            class: "user",
            "data-id": this.id,
        });
        $html.append($("<div/>", {
            class: "user-name",
            text: this.id,
        }));
        $html.append($("<div/>", {
            class: "user-count",
            text: this.count,
        }));
        return $html;
    }
}

class Response {
    datetime;
    message;
    name;
    mail;
    id;
    count;

    constructor(datetime, message, name, mail, id, count) {
        this.datetime = datetime;
        this.message = message;
        this.count = count;
        this.name = name;
        this.mail = mail;
        this.id = id;
    }

    /**
     * ���ߍ��݃R���e���c��u�����܂��B
     * @param {String} text �u���O�̃e�L�X�g
     * @returns 
     */
    replaceHtml(text) {
        return text.replace(/((https|http):\/\/[\x21-\x7e]+)/g, function(url) {
            // �摜
            if(url.match(/\.(jpg|jpeg|png|gif)$/)) {
                return '<div class="preview"><a href="' + url + '" target="_blank"><img src="' + url + '" alt="' + url + '" class="img-fluid mb-1"></a></div>';
            }
            // Youtube
            else if(url.match(/(https|http):\/\/(www|m)\.youtube\.com\/watch\?v=([a-zA-Z0-9\-_]+)/)) {
                const id = url.match(/(https|http):\/\/(www|m)\.youtube\.com\/watch\?v=([a-zA-Z0-9\-_]+)/)[3];
                return '<iframe src="https://www.youtube.com/embed/' + id + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            }
            // Youtube �Z�k��
            else if(url.match(/(https|http):\/\/youtu\.be\/([a-zA-Z0-9\-_]+)/)) {
                const id = url.match(/(https|http):\/\/youtu\.be\/([a-zA-Z0-9\-_]+)/)[2];
                return '<iframe src="https://www.youtube.com/embed/' + id + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            }
            // nicovideo
            else if(url.match(/(https|http):\/\/(www|sp)\.nicovideo\.jp\/watch\/sm([a-zA-Z0-9]+)/)) {
                const id = url.match(/(https|http):\/\/(www|sp)\.nicovideo\.jp\/watch\/sm([a-zA-Z0-9]+)/)[3];
                return '<iframe src="https://embed.nicovideo.jp/watch/sm' + id + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            }
            // ���̑��̃����N
            else {
                return '<a href="' + url + '" target="_blank">' + url + '</a>';
            }
        });
    }

    /**
     * ���̃C���X�^���X�̓��e��HTML�v�f�ɕϊ����܂��B
     * @returns 
     */
    toHTML() {
        const self = this;
        let message = self.replaceHtml(self.message);
        const $elem = $("<div></div>", {
            class: "response container-fluid border-top mb-5",
        });
        const $header = $("<div></div>", {
            class: "row row-cols-auto",
            style: "font-size: 13px;",
        });
        $header.append($("<span></span>", {
            class: "col p-0"
        }).text(self.count + ":"));
        $header.append($("<a></a>", self.mail ? {href: "mailto:" + self.mail} : {}).html(self.name));
        $header.append($("<div></div>", {
            class: "col"
        }).text(self.datetime));
        $header.append($("<div></div>", {
            class: "col"
        }).text(self.id));
        const $body = $("<div></div>", {
            class: "text-break"
        }).html(message);
        const $footer = $("<div></div>", {
            style: "font-size: 10px; color: gray;"
        });

        $elem.append($header);
        $elem.append($body); 
        $elem.append($footer);

        return $elem;
    }
}

class Thread {
    datetime;
    title;
    count;
    fileName;
    responseList;
    range;
    lastModified;
    isReset; // ���Z�b�g���ꂽ���ǂ���

    constructor(title, count, datetime, fileName) {
        this.count = count;
        this.title = title;
        this.datetime = datetime;
        this.fileName = fileName;
        this.responseList = [];
        this.range = 0;
        this.lastModified = "";
        this.isReset = false;
    }

    toHTML() {
        const self = this;
        const $elem = $("<div></div>");
        $.each(self.responseList, function() {
            $elem.append(this.toHTML());
        });

        if(DEBUG) console.log("���X�ꗗ�𐶐����܂����B", $elem);
        return $elem;

    }

    getBBSName() {
        const array = new URL(convertPathUrl("../")).pathname.split("/");
        array.pop(); // �S�~�̓S�~����
        return array.pop();
    }

    getKey() {
        // �t�@�C��������g���q�������Ċi�[
        var subject = this.fileName.split(".");
        subject.pop();
        subject = subject.join(".");

        return subject;
    }

    write($form) {
        const self = this;
        const data = self.toFormUrlEncoded($form);
        return $.ajax(
            {
                url: '../../test/bbs.cgi?guid=ON',
                contentType: 'application/x-www-form-urlencoded',
                type: 'POST',
                data: data,
                dataType: 'html',
                cache: false
            }
        ).then(function(text) {
            if(DEBUG)  console.log('�������݂܂����B')
        }).catch(function (jqXHR, textStatus, errorThrown) {
            const msg = '�������݂Ɏ��s���܂����B';
            error(msg, jqXHR, textStatus, errorThrown);
        });
    }

    toFormUrlEncoded($form) {
        const self = this;
        const queryString = $form.serialize()
        const param = [...new URLSearchParams(queryString).entries()].reduce((obj, e) => ({...obj, [e[0]]: e[1]}), {});
        let res = ""
        for (let key in param) {
            res += "&" + key + "=" + sjisUrlEncodeForHtml(param[key]);
        }
        res = res.replace("&", '');
        return res;
    }

    load() {
        const self = this;
        return $.ajax(
            {
                url: '../dat/' + encodeURIComponent(self.fileName),
                type: 'get',
                dataType: 'text',
                headers: {
                    'Range': 'bytes=' + (self.range) + '-', // ���X�͈̔͂��w��
                    'If-Modified-Since': self.lastModified, // �ŏI�X�V�������w��
                },
                cache: false
            }
        ).then(function(text, textStatus, jqXHR) {
            self.isReset = false;
            if(text == null || text == "") {
                if(DEBUG) console.log("�X�V�͂���܂���B");
                return;
            }
            // ���ځ[�񌟒m
            if(self.responseList.length > 0 && text.charCodeAt(0) !== 0x0a) { // �����擾�Ȃ̂ɁA"\n"�Ŏn�܂�Ȃ��ꍇ
                self.reset();
                return;
            }
            // �p�[�X
            const rowArray = text.split('\n');
            const offset = self.responseList.length;
            for(let i = 0; i < rowArray.length; i++) {
                const dataArray = rowArray[i].split("<>");
                if(dataArray.length === 5){
                    dataArray[2] = dataArray[2].split(" ");
                    const id = dataArray[2].pop();
                    dataArray[2] = dataArray[2].join(" ");
                    self.responseList.push(new Response(
                        dataArray[2],
                        dataArray[3],
                        dataArray[0],
                        dataArray[1],
                        id,
                        i + 1 + offset,
                    ));
                }
            }
            // �w�b�_�[�����擾
            self.lastModified = jqXHR.getResponseHeader('Last-Modified');
            const range = jqXHR.getResponseHeader('Content-Length').split("/");
            self.range += Number(range.length > 1 ? range[1] : range[0]) -1; // ���s�R�[�h�������擾���邽�߂�-1����
            
            if(DEBUG) console.log(self.fileName + "��ǂݍ��݂܂����B", self);

        }).catch(function (jqXHR, textStatus, errorThrown) {
            // ���ځ[��̉e���Ŏ擾�Ɏ��s�����ꍇ
            if(jqXHR.status === 416) {
                self.reset();
                return;
            }

            const msg = this.fileName + '�̓ǂݎ��Ɏ��s���܂����B';
            error(msg, jqXHR, textStatus, errorThrown);
        });
    }

    reset() {
        const self = this;
        self.range = 0;
        self.lastModified = "";
        self.responseList = [];
        self.isReset = true;

        if(DEBUG) console.log("���ځ[������m���܂����B\n" + self.fileName + "�����Z�b�g���܂����B", self);
    }
}

/**
 * ��\�����܂��B�e��ݒ�l��X���b�h�̃��X�g�������܂��B
 */
class Board {
    setting;
    threadList;

    /**
     * �������������������I�I�I�I�S�������I�����I�����I
     * @returns DOM�v�f�i�X���ꗗ�j
     */
    toHTML(fileName) {
        const $elem = $("<div></div>");
        $.each(board.threadList, function() {
            const thread = this;
            const borderType = thread.fileName === fileName ? "border-primary border-3" : "border-secondary";
            const $row = $("<a></a>", {
                href: "./detail.html?file=" + encodeURIComponent(thread.fileName), // URL�G���R�͂قƂ�ǕK�v����܂��񂪁A���܂��Ȃ��ł�
                style: "text-decoration: none; color: black;",
            }).append(
                $("<div></div>", {
                    class: "bg-white rounded p-2 mb-2 border " + borderType,
                    on: {
                        mouseenter: function() {
                            $(this).addClass("bg-light");
                            $(this).removeClass("bg-white");
                        },
                        mouseleave: function() {
                            $(this).addClass("bg-white");
                            $(this).removeClass("bg-light");
                        }
                    }
                }).html(thread.title + " (" + thread.count + ")").append(
                    $("<div></div>", {
                        style: "font-size: 10px; color: gray;"
                    }).append("<div></div>").text(thread.datetime.getFullYear() + "/" + (thread.datetime.getMonth() + 1) + "/" + thread.datetime.getDate() + " " + thread.datetime.getHours() + ":" + thread.datetime.getMinutes())
                )
            );
            $elem.append($row);
        })
        if(DEBUG) console.log("�X���ꗗ�𐶐����܂����B", $elem);
        return $elem;
    }

    /**
     * �ŐV��subject.txt��ǂݎ��AthreadList���X�V���܂��B
     * @returns 
     */
    loadThreadList() {
        const self = this;

        return $.ajax(
            {
                url: '../subject.txt',
                type: 'get',
                dataType: 'text',
                cache: false
            }
        ).then(function(text) {
            self.threadList = {};
            // �p�[�X
            const rowArray = text.split('\n');
            for(let i = 0; i < rowArray.length; i++) {
                const dataArray = rowArray[i].split("<>");
                if(dataArray.length == 2) {
                    const tempArray = dataArray[1].split(" ");
                    if(tempArray.length > 1) { // �X���^�C�ɋ󔒂��܂܂�Ă���ꍇlength�͂R�ȏ�ɂȂ�܂��B
                        const count = Number(tempArray.pop().replace(/[^0-9]/g, ''));
                        const title = tempArray.join(' ');
                        const datetime = new Date(Number(dataArray[0].replace(/[^0-9]/g, '')*1000)); // �b���~���b�ɒ����Ă܂��B

                        self.threadList[dataArray[0]] = new Thread(title, count, datetime, dataArray[0]);
                    }
                }
            }
            if(DEBUG)  console.log("subject.txt��ǂݍ��݂܂����B", self.threadList);
        }).catch(function (jqXHR, textStatus, errorThrown) {
            const msg = 'subject.txt�̓ǂݎ��Ɏ��s���܂����B';
            error(msg, jqXHR, textStatus, errorThrown);
        });
    }

    /**
     * �ŐV��SETTING.TXT��ǂݎ��Asetting���X�V���܂��B
     * @returns 
     */
    loadSetting() {
        const self = this;
        return $.ajax(
            {
                url: '../SETTING.TXT',
                type: 'get',
                dataType: 'text',
                cache: false
            }
        ).then(function(text) {
            self.setting = {};
            // �p�[�X���Ċi�[
            const array = text.split('\n');
            $.each(array, function() {
                const keyValueArray = this.split(/(^.+?)(=)/)
                if(keyValueArray.length === 4) {
                    self.setting[$.trim(keyValueArray[1])] = $.trim(keyValueArray[3]);
                }
            })
            if(DEBUG) console.log("SETTING.TXT��ǂݎ��܂����B", self.setting);
        }).catch(function (jqXHR, textStatus, errorThrown) {
            const msg = 'SETTING.TXT�̓ǂݎ��Ɏ��s���܂����B';
            error(msg, jqXHR, textStatus, errorThrown);
        });
    }
}