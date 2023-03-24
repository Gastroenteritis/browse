import { Mutex, Semaphore } from 'https://unpkg.com/async-mutex@0.3.2/index.mjs';

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

export class Response {
    board;
    thread;
    dateTime;
    message;
    name;
    mail;
    id;
    count;

    constructor(board, thread, dateTime, message, name, mail, id, count) {
        this.board = board;
        this.thread = thread;
        this.dateTime = dateTime;
        this.message = this.replaceHtml(message);
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
}

export class Thread {
    board;
    dateTime;
    title;
    count;
    fileName;
    responseList;
    range;
    lastModified;
    errorTitle;
    errorMessage;
    error;
    loadLock;

    constructor(board, title, count, fileName) {
        this.board = board;
        this.count = count;
        this.title = title;
        this.fileName = fileName;
        this.dateTime = new Date(Number(fileName.replace(/[^0-9]/g, '')*1000)); // Date型に合わせて秒をミリ秒換算にしてから使用しています。
        
        this.responseList = [];
        this.range = 0;
        this.lastModified = "";
        this.errorTitle = "";
        this.errorMessage = "";
        this.error = null;
        this.loadLock = new Mutex();
    }

    isActive() {
        return this.board.activeThread === this;
    }

    /**
     * JaneStyle基準
     * 勢い=レス数÷スレが立ってからの分数×60×24
     */
    getIkioi() {
        const now = new Date();
        const diff = now.getTime() - this.dateTime.getTime();
        const diffMin = diff / 1000 / 60;
        const ikioi = this.count / diffMin * 60 * 24;
        // 小数点以下を切り捨て
        return Math.floor(ikioi);
    }

    setCount(count) {
        this.count = count;
    }

    /**
     * 最低限の情報を残してデータをリセットします。
     */
    purge() {
        const self = this;
        self.range = 0;
        self.lastModified = "";
        self.responseList = [];
    }

    toHTML() {
        const self = this;
        const $elem = $("<div></div>");
        $.each(self.responseList, function() {
            $elem.append(this.toHTML());
        });

        console.log("レス一覧を生成しました。", $elem);
        return $elem;

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
        return $.ajax({
            url: '../../test/bbs.cgi?guid=ON',
            contentType: 'application/x-www-form-urlencoded',
            type: 'POST',
            data: data,
            dataType: 'html',
            cache: false
        }).then(async function(data, textStatus, jqXHR) {
            await self._load();
            return data, textStatus, jqXHR;
        });
    }

    toFormUrlEncoded($form) {
        const self = this;
        const queryString = $form.serialize()
        const param = [...new URLSearchParams(queryString).entries()].reduce((obj, e) => ({...obj, [e[0]]: e[1]}), {});
        let res = ""
        for (let key in param) {
            res += "&" + key + "=" + self.sjisUrlEncodeForHtml(param[key]);
        }
        res = res.replace("&", '');
        return res;
    }

    async _autoReload() {
        const self = this;
        setTimeout(function() {
            // アクティブなスレッドに指定されている場合
            if(self.board.activeThread === self) {
                self._load().then(function(){
                    self._autoReload();
                });
            }
            // アクティブなスレッドに指定されていない場合
            else {
                self.purge();
            }
        }, 10000);
    }

    async load() {
        const self = this;
        self.board.activeThread = self;
        return await self._load().then(function() {
            self._autoReload();
        });
    }

    /**
     * HTTPリクエストを送ったりパースしたりする
     */
    async _load() {
        // ページが非表示の場合は差分取得を行わない。
        if (document.hidden && this.range !== 0) {
            return;
        }

        const release = await this.loadLock.acquire(); // 排他制御の開始と、その終了のための関数を取得
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
            // レスポンスがなかった場合
            if(text == null || text.trim() === "") { // 改行コードだけ明示的に取得しているので空白を除去
                // console.log("更新はありません。");
                return;
            }
            // あぼーん検知
            if(self.responseList.length > 0 && text.charCodeAt(0) !== 0x0a) { // 差分取得なのに、"\n"で始まらない場合
                self.abon();
                return;
            }
            // 取得成功
            const rowArray = text.split('\n');
            const offset = self.responseList.length;
            let count = 0;
            for(let i = 0; i < rowArray.length; i++) {
                const dataArray = rowArray[i].split("<>");
                if(dataArray.length === 5){
                    dataArray[2] = dataArray[2].split(" ");
                    const id = dataArray[2].pop();
                    dataArray[2] = dataArray[2].join(" ");
                    self.responseList.push(new Response(
                        self.board,         // このスレが属する板
                        self,               // このスレ
                        dataArray[2],       // 日時
                        dataArray[3],       // 本文
                        dataArray[0],       // 名前
                        dataArray[1],       // メール
                        id,                 // ID
                        ++count + offset, // レス番号
                    ));
                    
                    // スレッドの情報を更新
                    self.count = self.responseList.length;
                }
            }
            // ヘッダー情報を取得
            self.lastModified = jqXHR.getResponseHeader('Last-Modified');
            const range = jqXHR.getResponseHeader('Content-Length').split("/");
            self.range += Number(range.length > 1 ? range[1] : range[0]) -1; // 改行コードを差分取得するために-1する
            
            console.log(self.fileName + "を読み込みました。", self);

        }).catch(function (jqXHR, textStatus, errorThrown) {
            // あぼーんの影響で取得に失敗しサーバーエラーになった場合
            if(jqXHR.status === 416) {
                self.abon();
                return;
            }

            const msg = this.fileName + 'の読み取りに失敗しました。';
            error(msg, jqXHR, textStatus, errorThrown);
        }).always(function() {
            release(); // 排他制御の終了
        });
    }

    /**
     * あぼーんを検知した場合に呼び出されます。
     * データをリセットし、エラーを表示します。
     */
    abon() {
        this.purge();
        console.error("あぼーんを検知したため、" + self.fileName + "をリセットしました。", self);
    }

    /**
     * 文字列がShiftJISに変換できるかどうかを判定します。
     * @param {string} str テキスト
     */
    isShiftJIS(str) {
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
    sjisUrlEncodeForHtml(str) {
        // 文字コードの配列に変換
        const unicodeArray = [];
        for (let i = 0; i < str.length; i++) {
            // 文字コードに変換
            var code = str.charCodeAt(i);
            
            // ShiftJISに変換できる文字なら
            if (this.isShiftJIS(str.charAt(i))) {
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
}

/**
 * 板を表現します。各種設定値やスレッドのリストを持ちます。
 */
export class Board {
    setting;
    threadList;
    activeThread;
    listLoadLock;
    lastModified;

    async init() {
        this.threadList = [];
        this.activeThread = null; // Threadの実装を確認してください。
        this.setting = {};
        this.listLoadLock = new Mutex();

        // 設定を読み込みます。
        await this._loadSetting();
        await this.manualReload();
    }
    
    /**
     * 現在のURLからbbsの物理名を取得します。
     * （注意: コレは論理名ではなくリクエスト等で有効な英数字のものです。)
     * @returns 板の名前
     */
    getBBSName() {
        const array = new URL(this.convertPathUrl("../")).pathname.split("/");
        array.pop(); // ゴミはゴミ箱へ
        return array.pop();
    }

    /**
     * 相対パスを絶対パスに変換します。
     * @param {string} src 変換する相対パス 
     * @returns 
     */
    convertPathUrl( src ) {
        return $("<a>").attr("href", src).get(0).href;
    }

    autoReload() {
        const self = this;
        setTimeout(function() {
            self.manualReload().then(function() {
                self.autoReload();
            });
        }, 10000);
    }

    getThread(fileName) {
        for(let i = 0; i < this.threadList.length; i++) {
            if(this.threadList[i].fileName == fileName) {
                return this.threadList[i];
            }
        }
        return null;
    }

    /**
     * 最新のsubject.txtを読み取り、threadListを更新します。
     * @returns 
     */
    async manualReload() {
        const self = this;
        const release = await this.listLoadLock.acquire();
        await $.ajax(
            {
                url: '../subject.txt',
                type: 'get',
                dataType: 'text',
                cache: false
            }
        ).then(function(data, textStatus, jqXHR) {
            const newThreadList = [];
            // パース
            const rowArray = data.split('\n');
            for(let i = 0; i < rowArray.length; i++) {
                const dataArray = rowArray[i].split("<>");
                if(dataArray.length == 2) {
                    const tempArray = dataArray[1].split(" ");
                    if(tempArray.length > 1) { // スレタイに空白が含まれている場合lengthは３以上になります。
                        const fileName = dataArray[0];
                        const count = Number(tempArray.pop().replace(/[^0-9]/g, ''));
                        const title = tempArray.join(' ');

                        const oldThread = self.getThread(fileName);
                        if(oldThread) {
                            oldThread.title = title;
                            oldThread.count = count;
                            newThreadList.push(oldThread); // 既存スレッド
                        } else {
                            newThreadList.push(new Thread(self, title, count, fileName));
                        }
                    }
                }
            }
            // 適用
            self.threadList.splice(0, self.threadList.length);
            self.threadList.push(...newThreadList);
            self.lastModified = jqXHR.getResponseHeader('Last-Modified');
            console.log("subject.txtを読み込みました。");
        }).catch(function (jqXHR, textStatus, errorThrown) {
            const msg = 'subject.txtの読み取りに失敗しました。';
            error(msg, jqXHR, textStatus, errorThrown);
        }).always(function() {
            release();
        });
    }

    /**
     * 最新のSETTING.TXTを読み取り、settingを更新します。
     * @returns 
     */
    _loadSetting() {
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
            // パース
            const array = text.split('\n');
            $.each(array, function() {
                const keyValueArray = this.split(/(^.+?)(=)/)
                if(keyValueArray.length === 4) {
                    self.setting[$.trim(keyValueArray[1])] = $.trim(keyValueArray[3]);
                }
            })
            console.log("SETTING.TXTを読み取りました。", self.setting);
        }).catch(function (jqXHR, textStatus, errorThrown) {
            const msg = 'SETTING.TXTの読み取りに失敗しました。';
            error(msg, jqXHR, textStatus, errorThrown);
        });
    }
}