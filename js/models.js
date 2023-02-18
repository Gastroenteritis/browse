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
     * �e�L�X�g�̃����N��u������
     * @param {*} text 
     */
    replaceLink(text) {
        return text.replace(/(https?:\/\/[\x21-\x7e]+)/g, '<a href="$1" target="_blank">$1</a>');
    }

    toHTML() {
        const self = this;
        const $elem = $("<div></div>", {
            class: "container-fluid border-top",
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
        }).html(self.replaceLink(self.message));
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

    constructor(title, count, datetime, fileName) {
        this.count = count;
        this.title = title;
        this.datetime = datetime;
        this.fileName = fileName;
    }

    toHTML() {
        const self = this;
        const $elem = $("<div></div>").append($("<h3></h3>").html(self.title));
        $.each(self.responseList, function() {
            $elem.append(this.toHTML());
            $elem.append($("<br><br>"));
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
        ).done(function(text) {
            if(DEBUG)  console.log('�������݂܂����B');
            location.reload();
        }).fail(function (jqXHR, textStatus, errorThrown) {
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
            res += "&" + EscapeSJIS(key) + "=" + EscapeSJIS(param[key]);
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
                cache: false
            }
        ).done(function(text) {
            self.responseList = [];
            // �p�[�X
            const rowArray = text.split('\n');
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
                        i + 1,
                    ));
                }
            }
            if(DEBUG)  console.log(self.fileName + "��ǂݍ��݂܂����B", self.responseList);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            const msg = this.fileName + '�̓ǂݎ��Ɏ��s���܂����B';
            error(msg, jqXHR, textStatus, errorThrown);
        });
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
        ).done(function(text) {
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
        }).fail(function (jqXHR, textStatus, errorThrown) {
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
        ).done(function(text) {
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
        }).fail(function (jqXHR, textStatus, errorThrown) {
            const msg = 'SETTING.TXT�̓ǂݎ��Ɏ��s���܂����B';
            error(msg, jqXHR, textStatus, errorThrown);
        });
    }
}