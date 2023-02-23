/**
 * 文字列がShiftJISに変換できるかどうかを判定します。
 * @param {string} str テキスト
 */
isShiftJIS = function(str) {
    // 英数字
    if (str.match(/^[0-9A-Za-z]+$/)) {
        return true;
    }
    // 半角カナ
    if (str.match(/^[ｦ-ﾟ]+$/)) {
        return true;
    }
    // 半角記号
    if (str.match(/^[!-\/:-@[-`{-~]+$/)) {
        return true;
    }
    // 半角スペース
    if (str.match(/^[\s]+$/)) {
        return true;
    }
    // 全角文字
    if (str.match(/^[ぁ-んァ-ヶー一-龠々〆?]+$/)) {
        return true;
    }
    // 全角記号
    if (str.match(/^[\！-\／\：-\＠\［-\｀\｛-～]+$/)) {
        return true;
    }
    // 全角スペース
    if (str.match(/^[\u3000]+$/)) {
        return true;
    }
    // それ以外
    return false;
}

/**
 * 文字列をSJISに変換してURLエンコードする
 * @param {string} str 文字列
 */
sjisUrlEncodeForHtml = function(str) {
    // 文字コードの配列に変換
    const unicodeArray = [];
    for (let i = 0; i < str.length; i++) {
        // 文字コードに変換
        var code = str.charCodeAt(i);
        
        // ShiftJISに変換できる文字なら
        if (isShiftJIS(str.charAt(i))) {
            unicodeArray.push(code);
        } 
        // ShiftJISに変換できない文字はHTMLEntityに変換する
        else {
            // サロゲートペアの場合は２文字分を１文字として扱う
            if (0xd800 <= code && code <= 0xdbff) {
                const code2 = str.charCodeAt(i + 1);
                if (0xdc00 <= code2 && code2 <= 0xdfff) {
                    i++;
                    code = ((code - 0xd800) << 10) + (code2 - 0xdc00) + 0x10000;
                }
            }
            // HTMLエンティティに変換
            const entity = "&#" + code + ";";
            // entityを１文字ずつ文字コードに変換して配列に追加
            for (let j = 0; j < entity.length; j++) {
                unicodeArray.push(entity.charCodeAt(j));
            }
        }
    }

    // SJINSに変換
    const sjisBytes = Encoding.convert(unicodeArray, {
        to: 'SJIS',
        from: 'UNICODE',
    });
    // URLエンコードする
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
     * レスポンスを追加します。
     */
    addResponse(response) {
        this.responseList.push(response);
        count++;
    }

    /**
     * このインスタンスの内容をHTML要素に変換します。
     * @returns {jQuery} 変換後のHTML要素
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
     * 埋め込みコンテンツを置換します。
     * @param {String} text 置換前のテキスト
     * @returns 
     */
    replaceHtml(text) {
        return text.replace(/((https|http):\/\/[\x21-\x7e]+)/g, function(url) {
            // 画像
            if(url.match(/\.(jpg|jpeg|png|gif)$/)) {
                return '<div class="preview"><a href="' + url + '" target="_blank"><img src="' + url + '" alt="' + url + '" class="img-fluid mb-1"></a></div>';
            }
            // Youtube
            else if(url.match(/(https|http):\/\/(www|m)\.youtube\.com\/watch\?v=([a-zA-Z0-9\-_]+)/)) {
                const id = url.match(/(https|http):\/\/(www|m)\.youtube\.com\/watch\?v=([a-zA-Z0-9\-_]+)/)[3];
                return '<iframe src="https://www.youtube.com/embed/' + id + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            }
            // Youtube 短縮版
            else if(url.match(/(https|http):\/\/youtu\.be\/([a-zA-Z0-9\-_]+)/)) {
                const id = url.match(/(https|http):\/\/youtu\.be\/([a-zA-Z0-9\-_]+)/)[2];
                return '<iframe src="https://www.youtube.com/embed/' + id + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            }
            // nicovideo
            else if(url.match(/(https|http):\/\/(www|sp)\.nicovideo\.jp\/watch\/sm([a-zA-Z0-9]+)/)) {
                const id = url.match(/(https|http):\/\/(www|sp)\.nicovideo\.jp\/watch\/sm([a-zA-Z0-9]+)/)[3];
                return '<iframe src="https://embed.nicovideo.jp/watch/sm' + id + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            }
            // その他のリンク
            else {
                return '<a href="' + url + '" target="_blank">' + url + '</a>';
            }
        });
    }

    /**
     * このインスタンスの内容をHTML要素に変換します。
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
    isReset; // リセットされたかどうか

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

        if(DEBUG) console.log("レス一覧を生成しました。", $elem);
        return $elem;

    }

    getBBSName() {
        const array = new URL(convertPathUrl("../")).pathname.split("/");
        array.pop(); // ゴミはゴミ箱へ
        return array.pop();
    }

    getKey() {
        // ファイル名から拡張子を除いて格納
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
            if(DEBUG)  console.log('書き込みました。')
        }).catch(function (jqXHR, textStatus, errorThrown) {
            const msg = '書き込みに失敗しました。';
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
                    'Range': 'bytes=' + (self.range) + '-', // レスの範囲を指定
                    'If-Modified-Since': self.lastModified, // 最終更新日時を指定
                },
                cache: false
            }
        ).then(function(text, textStatus, jqXHR) {
            self.isReset = false;
            if(text == null || text == "") {
                if(DEBUG) console.log("更新はありません。");
                return;
            }
            // あぼーん検知
            if(self.responseList.length > 0 && text.charCodeAt(0) !== 0x0a) { // 差分取得なのに、"\n"で始まらない場合
                self.reset();
                return;
            }
            // パース
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
            // ヘッダー情報を取得
            self.lastModified = jqXHR.getResponseHeader('Last-Modified');
            const range = jqXHR.getResponseHeader('Content-Length').split("/");
            self.range += Number(range.length > 1 ? range[1] : range[0]) -1; // 改行コードを差分取得するために-1する
            
            if(DEBUG) console.log(self.fileName + "を読み込みました。", self);

        }).catch(function (jqXHR, textStatus, errorThrown) {
            // あぼーんの影響で取得に失敗した場合
            if(jqXHR.status === 416) {
                self.reset();
                return;
            }

            const msg = this.fileName + 'の読み取りに失敗しました。';
            error(msg, jqXHR, textStatus, errorThrown);
        });
    }

    reset() {
        const self = this;
        self.range = 0;
        self.lastModified = "";
        self.responseList = [];
        self.isReset = true;

        if(DEBUG) console.log("あぼーんを検知しました。\n" + self.fileName + "をリセットしました。", self);
    }
}

/**
 * 板を表現します。各種設定値やスレッドのリストを持ちます。
 */
class Board {
    setting;
    threadList;

    /**
     * うおおおおおおおお！！！！ゴリ押せ！いけ！おせ！
     * @returns DOM要素（スレ一覧）
     */
    toHTML(fileName) {
        const self = this;
        const $elem = $("<div></div>");
        $.each(self.threadList, function() {
            const thread = this;
            const borderType = thread.fileName === fileName ? "border-primary border-3" : "border-secondary";
            const $row = $("<a></a>", {
                href: "./detail.html?file=" + encodeURIComponent(thread.fileName), // URLエンコはほとんど必要ありませんが、おまじないです
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
        if(DEBUG) console.log("スレ一覧を生成しました。", $elem);
        return $elem;
    }

    /**
     * 非同期処理を開始します。
     * 具体的にはSETTING.TXTとsubject.txtを読み取ります。
     * @returns Promiseの配列
    */
    load() {
        const promises = [];
        promises.push(this.loadThreadList());
        promises.push(this.loadSetting());
        return promises;
    }

    /**
     * 最新のsubject.txtを読み取り、threadListを更新します。
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
            // パース
            const rowArray = text.split('\n');
            for(let i = 0; i < rowArray.length; i++) {
                const dataArray = rowArray[i].split("<>");
                if(dataArray.length == 2) {
                    const tempArray = dataArray[1].split(" ");
                    if(tempArray.length > 1) { // スレタイに空白が含まれている場合lengthは３以上になります。
                        const count = Number(tempArray.pop().replace(/[^0-9]/g, ''));
                        const title = tempArray.join(' ');
                        const datetime = new Date(Number(dataArray[0].replace(/[^0-9]/g, '')*1000)); // 秒をミリ秒に直してます。

                        self.threadList[dataArray[0]] = new Thread(title, count, datetime, dataArray[0]);
                    }
                }
            }
            if(DEBUG)  console.log("subject.txtを読み込みました。", self.threadList);
        }).catch(function (jqXHR, textStatus, errorThrown) {
            const msg = 'subject.txtの読み取りに失敗しました。';
            error(msg, jqXHR, textStatus, errorThrown);
        });
    }

    /**
     * 最新のSETTING.TXTを読み取り、settingを更新します。
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
            // パースして格納
            const array = text.split('\n');
            $.each(array, function() {
                const keyValueArray = this.split(/(^.+?)(=)/)
                if(keyValueArray.length === 4) {
                    self.setting[$.trim(keyValueArray[1])] = $.trim(keyValueArray[3]);
                }
            })
            if(DEBUG) console.log("SETTING.TXTを読み取りました。", self.setting);
        }).catch(function (jqXHR, textStatus, errorThrown) {
            const msg = 'SETTING.TXTの読み取りに失敗しました。';
            error(msg, jqXHR, textStatus, errorThrown);
        });
    }
}