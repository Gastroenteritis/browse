/**
 * SJISに変換してURLエンコードする
日本語
americago
???
?（＾V＾）?
 */
// 65374 OK
// 12316 NG

/**
 * 文字列をSJISに変換してURLエンコードする
 * @param {string} str 文字列
 */
sjisUrlEncode = function(str) {
    // 絵文字のエスケープ
    str = emojiHtmlEncode(str);
    str = specialHtmlEncode(str);

	const unicodeArray = [];
	for (let i = 0; i < str.length; i++) {
		unicodeArray.push(str.charCodeAt(i));
	}
	const sjisArray = Encoding.convert(unicodeArray, {
		to: 'SJIS',
		from: 'UNICODE',
	});
	return Encoding.urlEncode(sjisArray);
}

/**
 * 正規表現でSJISが表現できない文字をHTMLエンティティに変換する
 * @param {string} str 文字列
*/
specialHtmlEncode = function(str) {
    // SJISで表現できない文字をエスケープ
    const regex = /[^\x00-\x7F\xA1-\xDF]|[\x81-\x9F\xE0-\xFC][\x40-\x7E\x80-\xFC]/g;
    return str.replace(regex, function(match) {
        const code = match.codePointAt(0).toString(16);
        return '&#x' + code + ';';
    });
}

/**
 * 文字列中の絵文字をHTMLエンティティに変換する
 * @param {string} str 文字列
 */
emojiHtmlEncode = function(str) {
    const regex = emojiRegex();
    return str.replace(regex, function(match) {
        // 絵文字をHTMLEntityに変換する
        const code = match.codePointAt(0).toString(16);
        return '&#x' + code + ';';
    });
}

/**
 * 絵文字の正規表現を返す
 * @copyright Copyright Mathias Bynens <https://mathiasbynens.be/>
 * @license the MIT license
 * @see https://github.com/mathiasbynens/emoji-regex
 * @returns {RegExp} 絵文字の正規表現
 */
function emojiRegex(){
    return /\u{1F3F4}\u{E0067}\u{E0062}(?:\u{E0077}\u{E006C}\u{E0073}|\u{E0073}\u{E0063}\u{E0074}|\u{E0065}\u{E006E}\u{E0067})\u{E007F}|\u{1F469}\u200D\u{1F469}\u200D(?:\u{1F466}\u200D\u{1F466}|\u{1F467}\u200D[\u{1F466}\u{1F467}])|\u{1F468}(?:\u{1F3FF}\u200D(?:\u{1F91D}\u200D\u{1F468}[\u{1F3FB}-\u{1F3FE}]|[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FE}\u200D(?:\u{1F91D}\u200D\u{1F468}[\u{1F3FB}-\u{1F3FD}\u{1F3FF}]|[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FD}\u200D(?:\u{1F91D}\u200D\u{1F468}[\u{1F3FB}\u{1F3FC}\u{1F3FE}\u{1F3FF}]|[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FC}\u200D(?:\u{1F91D}\u200D\u{1F468}[\u{1F3FB}\u{1F3FD}-\u{1F3FF}]|[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FB}\u200D(?:\u{1F91D}\u200D\u{1F468}[\u{1F3FC}-\u{1F3FF}]|[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u200D(?:\u2764\uFE0F\u200D(?:\u{1F48B}\u200D)?\u{1F468}|[\u{1F468}\u{1F469}]\u200D(?:\u{1F466}\u200D\u{1F466}|\u{1F467}\u200D[\u{1F466}\u{1F467}])|\u{1F466}\u200D\u{1F466}|\u{1F467}\u200D[\u{1F466}\u{1F467}]|[\u{1F468}\u{1F469}]\u200D[\u{1F466}\u{1F467}]|[\u2695\u2696\u2708]\uFE0F|[\u{1F466}\u{1F467}]|[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|(?:\u{1F3FF}\u200D[\u2695\u2696\u2708]|\u{1F3FE}\u200D[\u2695\u2696\u2708]|\u{1F3FD}\u200D[\u2695\u2696\u2708]|\u{1F3FC}\u200D[\u2695\u2696\u2708]|\u{1F3FB}\u200D[\u2695\u2696\u2708])\uFE0F|\u{1F3FF}|\u{1F3FE}|\u{1F3FD}|\u{1F3FC}|\u{1F3FB})?|\u{1F9D1}(?:[\u{1F3FB}-\u{1F3FF}]\u200D(?:\u{1F91D}\u200D\u{1F9D1}[\u{1F3FB}-\u{1F3FF}]|[\u{1F33E}\u{1F373}\u{1F37C}\u{1F384}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u200D(?:\u{1F91D}\u200D\u{1F9D1}|[\u{1F33E}\u{1F373}\u{1F37C}\u{1F384}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}]))|\u{1F469}(?:\u200D(?:\u2764\uFE0F\u200D(?:\u{1F48B}\u200D[\u{1F468}\u{1F469}]|[\u{1F468}\u{1F469}])|[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F3FF}\u200D[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}]|\u{1F3FE}\u200D[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}]|\u{1F3FD}\u200D[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}]|\u{1F3FC}\u200D[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}]|\u{1F3FB}\u200D[\u{1F33E}\u{1F373}\u{1F37C}\u{1F393}\u{1F3A4}\u{1F3A8}\u{1F3EB}\u{1F3ED}\u{1F4BB}\u{1F4BC}\u{1F527}\u{1F52C}\u{1F680}\u{1F692}\u{1F9AF}-\u{1F9B3}\u{1F9BC}\u{1F9BD}])|\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D[\u{1F468}\u{1F469}][\u{1F3FB}-\u{1F3FE}]|\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D[\u{1F468}\u{1F469}][\u{1F3FB}-\u{1F3FD}\u{1F3FF}]|\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D[\u{1F468}\u{1F469}][\u{1F3FB}\u{1F3FC}\u{1F3FE}\u{1F3FF}]|\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D[\u{1F468}\u{1F469}][\u{1F3FB}\u{1F3FD}-\u{1F3FF}]|\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D[\u{1F468}\u{1F469}][\u{1F3FC}-\u{1F3FF}]|\u{1F469}\u200D\u{1F466}\u200D\u{1F466}|\u{1F469}\u200D\u{1F469}\u200D[\u{1F466}\u{1F467}]|(?:\u{1F441}\uFE0F\u200D\u{1F5E8}|\u{1F469}(?:\u{1F3FF}\u200D[\u2695\u2696\u2708]|\u{1F3FE}\u200D[\u2695\u2696\u2708]|\u{1F3FD}\u200D[\u2695\u2696\u2708]|\u{1F3FC}\u200D[\u2695\u2696\u2708]|\u{1F3FB}\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\u{1F3F3}\uFE0F\u200D\u26A7|\u{1F9D1}(?:[\u{1F3FB}-\u{1F3FF}]\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\u{1F43B}\u200D\u2744|(?:[\u{1F3C3}\u{1F3C4}\u{1F3CA}\u{1F46E}\u{1F470}\u{1F471}\u{1F473}\u{1F477}\u{1F481}\u{1F482}\u{1F486}\u{1F487}\u{1F645}-\u{1F647}\u{1F64B}\u{1F64D}\u{1F64E}\u{1F6A3}\u{1F6B4}-\u{1F6B6}\u{1F926}\u{1F935}\u{1F937}-\u{1F939}\u{1F93D}\u{1F93E}\u{1F9B8}\u{1F9B9}\u{1F9CD}-\u{1F9CF}\u{1F9D6}-\u{1F9DD}][\u{1F3FB}-\u{1F3FF}]|[\u{1F46F}\u{1F93C}\u{1F9DE}\u{1F9DF}])\u200D[\u2640\u2642]|[\u26F9\u{1F3CB}\u{1F3CC}\u{1F575}][\uFE0F\u{1F3FB}-\u{1F3FF}]\u200D[\u2640\u2642]|\u{1F3F4}\u200D\u2620|[\u{1F3C3}\u{1F3C4}\u{1F3CA}\u{1F46E}\u{1F470}\u{1F471}\u{1F473}\u{1F477}\u{1F481}\u{1F482}\u{1F486}\u{1F487}\u{1F645}-\u{1F647}\u{1F64B}\u{1F64D}\u{1F64E}\u{1F6A3}\u{1F6B4}-\u{1F6B6}\u{1F926}\u{1F935}\u{1F937}-\u{1F939}\u{1F93D}\u{1F93E}\u{1F9B8}\u{1F9B9}\u{1F9CD}-\u{1F9CF}\u{1F9D6}-\u{1F9DD}]\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u2764\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299\u{1F170}\u{1F171}\u{1F17E}\u{1F17F}\u{1F202}\u{1F237}\u{1F321}\u{1F324}-\u{1F32C}\u{1F336}\u{1F37D}\u{1F396}\u{1F397}\u{1F399}-\u{1F39B}\u{1F39E}\u{1F39F}\u{1F3CD}\u{1F3CE}\u{1F3D4}-\u{1F3DF}\u{1F3F5}\u{1F3F7}\u{1F43F}\u{1F4FD}\u{1F549}\u{1F54A}\u{1F56F}\u{1F570}\u{1F573}\u{1F576}-\u{1F579}\u{1F587}\u{1F58A}-\u{1F58D}\u{1F5A5}\u{1F5A8}\u{1F5B1}\u{1F5B2}\u{1F5BC}\u{1F5C2}-\u{1F5C4}\u{1F5D1}-\u{1F5D3}\u{1F5DC}-\u{1F5DE}\u{1F5E1}\u{1F5E3}\u{1F5E8}\u{1F5EF}\u{1F5F3}\u{1F5FA}\u{1F6CB}\u{1F6CD}-\u{1F6CF}\u{1F6E0}-\u{1F6E5}\u{1F6E9}\u{1F6F0}\u{1F6F3}])\uFE0F|\u{1F469}\u200D\u{1F467}\u200D[\u{1F466}\u{1F467}]|\u{1F3F3}\uFE0F\u200D\u{1F308}|\u{1F469}\u200D\u{1F467}|\u{1F469}\u200D\u{1F466}|\u{1F415}\u200D\u{1F9BA}|\u{1F469}(?:\u{1F3FF}|\u{1F3FE}|\u{1F3FD}|\u{1F3FC}|\u{1F3FB})?|\u{1F1FD}\u{1F1F0}|\u{1F1F6}\u{1F1E6}|\u{1F1F4}\u{1F1F2}|\u{1F408}\u200D\u2B1B|\u{1F441}\uFE0F|\u{1F3F3}\uFE0F|\u{1F9D1}[\u{1F3FB}-\u{1F3FF}]?|\u{1F1FF}[\u{1F1E6}\u{1F1F2}\u{1F1FC}]|\u{1F1FE}[\u{1F1EA}\u{1F1F9}]|\u{1F1FC}[\u{1F1EB}\u{1F1F8}]|\u{1F1FB}[\u{1F1E6}\u{1F1E8}\u{1F1EA}\u{1F1EC}\u{1F1EE}\u{1F1F3}\u{1F1FA}]|\u{1F1FA}[\u{1F1E6}\u{1F1EC}\u{1F1F2}\u{1F1F3}\u{1F1F8}\u{1F1FE}\u{1F1FF}]|\u{1F1F9}[\u{1F1E6}\u{1F1E8}\u{1F1E9}\u{1F1EB}-\u{1F1ED}\u{1F1EF}-\u{1F1F4}\u{1F1F7}\u{1F1F9}\u{1F1FB}\u{1F1FC}\u{1F1FF}]|\u{1F1F8}[\u{1F1E6}-\u{1F1EA}\u{1F1EC}-\u{1F1F4}\u{1F1F7}-\u{1F1F9}\u{1F1FB}\u{1F1FD}-\u{1F1FF}]|\u{1F1F7}[\u{1F1EA}\u{1F1F4}\u{1F1F8}\u{1F1FA}\u{1F1FC}]|\u{1F1F5}[\u{1F1E6}\u{1F1EA}-\u{1F1ED}\u{1F1F0}-\u{1F1F3}\u{1F1F7}-\u{1F1F9}\u{1F1FC}\u{1F1FE}]|\u{1F1F3}[\u{1F1E6}\u{1F1E8}\u{1F1EA}-\u{1F1EC}\u{1F1EE}\u{1F1F1}\u{1F1F4}\u{1F1F5}\u{1F1F7}\u{1F1FA}\u{1F1FF}]|\u{1F1F2}[\u{1F1E6}\u{1F1E8}-\u{1F1ED}\u{1F1F0}-\u{1F1FF}]|\u{1F1F1}[\u{1F1E6}-\u{1F1E8}\u{1F1EE}\u{1F1F0}\u{1F1F7}-\u{1F1FB}\u{1F1FE}]|\u{1F1F0}[\u{1F1EA}\u{1F1EC}-\u{1F1EE}\u{1F1F2}\u{1F1F3}\u{1F1F5}\u{1F1F7}\u{1F1FC}\u{1F1FE}\u{1F1FF}]|\u{1F1EF}[\u{1F1EA}\u{1F1F2}\u{1F1F4}\u{1F1F5}]|\u{1F1EE}[\u{1F1E8}-\u{1F1EA}\u{1F1F1}-\u{1F1F4}\u{1F1F6}-\u{1F1F9}]|\u{1F1ED}[\u{1F1F0}\u{1F1F2}\u{1F1F3}\u{1F1F7}\u{1F1F9}\u{1F1FA}]|\u{1F1EC}[\u{1F1E6}\u{1F1E7}\u{1F1E9}-\u{1F1EE}\u{1F1F1}-\u{1F1F3}\u{1F1F5}-\u{1F1FA}\u{1F1FC}\u{1F1FE}]|\u{1F1EB}[\u{1F1EE}-\u{1F1F0}\u{1F1F2}\u{1F1F4}\u{1F1F7}]|\u{1F1EA}[\u{1F1E6}\u{1F1E8}\u{1F1EA}\u{1F1EC}\u{1F1ED}\u{1F1F7}-\u{1F1FA}]|\u{1F1E9}[\u{1F1EA}\u{1F1EC}\u{1F1EF}\u{1F1F0}\u{1F1F2}\u{1F1F4}\u{1F1FF}]|\u{1F1E8}[\u{1F1E6}\u{1F1E8}\u{1F1E9}\u{1F1EB}-\u{1F1EE}\u{1F1F0}-\u{1F1F5}\u{1F1F7}\u{1F1FA}-\u{1F1FF}]|\u{1F1E7}[\u{1F1E6}\u{1F1E7}\u{1F1E9}-\u{1F1EF}\u{1F1F1}-\u{1F1F4}\u{1F1F6}-\u{1F1F9}\u{1F1FB}\u{1F1FC}\u{1F1FE}\u{1F1FF}]|\u{1F1E6}[\u{1F1E8}-\u{1F1EC}\u{1F1EE}\u{1F1F1}\u{1F1F2}\u{1F1F4}\u{1F1F6}-\u{1F1FA}\u{1F1FC}\u{1F1FD}\u{1F1FF}]|[#\*0-9]\uFE0F\u20E3|[\u{1F3C3}\u{1F3C4}\u{1F3CA}\u{1F46E}\u{1F470}\u{1F471}\u{1F473}\u{1F477}\u{1F481}\u{1F482}\u{1F486}\u{1F487}\u{1F645}-\u{1F647}\u{1F64B}\u{1F64D}\u{1F64E}\u{1F6A3}\u{1F6B4}-\u{1F6B6}\u{1F926}\u{1F935}\u{1F937}-\u{1F939}\u{1F93D}\u{1F93E}\u{1F9B8}\u{1F9B9}\u{1F9CD}-\u{1F9CF}\u{1F9D6}-\u{1F9DD}][\u{1F3FB}-\u{1F3FF}]|[\u26F9\u{1F3CB}\u{1F3CC}\u{1F575}][\uFE0F\u{1F3FB}-\u{1F3FF}]|\u{1F3F4}|[\u270A\u270B\u{1F385}\u{1F3C2}\u{1F3C7}\u{1F442}\u{1F443}\u{1F446}-\u{1F450}\u{1F466}\u{1F467}\u{1F46B}-\u{1F46D}\u{1F472}\u{1F474}-\u{1F476}\u{1F478}\u{1F47C}\u{1F483}\u{1F485}\u{1F4AA}\u{1F57A}\u{1F595}\u{1F596}\u{1F64C}\u{1F64F}\u{1F6C0}\u{1F6CC}\u{1F90C}\u{1F90F}\u{1F918}-\u{1F91C}\u{1F91E}\u{1F91F}\u{1F930}-\u{1F934}\u{1F936}\u{1F977}\u{1F9B5}\u{1F9B6}\u{1F9BB}\u{1F9D2}-\u{1F9D5}][\u{1F3FB}-\u{1F3FF}]|[\u261D\u270C\u270D\u{1F574}\u{1F590}][\uFE0F\u{1F3FB}-\u{1F3FF}]|[\u270A\u270B\u{1F385}\u{1F3C2}\u{1F3C7}\u{1F408}\u{1F415}\u{1F43B}\u{1F442}\u{1F443}\u{1F446}-\u{1F450}\u{1F466}\u{1F467}\u{1F46B}-\u{1F46D}\u{1F472}\u{1F474}-\u{1F476}\u{1F478}\u{1F47C}\u{1F483}\u{1F485}\u{1F4AA}\u{1F57A}\u{1F595}\u{1F596}\u{1F64C}\u{1F64F}\u{1F6C0}\u{1F6CC}\u{1F90C}\u{1F90F}\u{1F918}-\u{1F91C}\u{1F91E}\u{1F91F}\u{1F930}-\u{1F934}\u{1F936}\u{1F977}\u{1F9B5}\u{1F9B6}\u{1F9BB}\u{1F9D2}-\u{1F9D5}]|[\u{1F3C3}\u{1F3C4}\u{1F3CA}\u{1F46E}\u{1F470}\u{1F471}\u{1F473}\u{1F477}\u{1F481}\u{1F482}\u{1F486}\u{1F487}\u{1F645}-\u{1F647}\u{1F64B}\u{1F64D}\u{1F64E}\u{1F6A3}\u{1F6B4}-\u{1F6B6}\u{1F926}\u{1F935}\u{1F937}-\u{1F939}\u{1F93D}\u{1F93E}\u{1F9B8}\u{1F9B9}\u{1F9CD}-\u{1F9CF}\u{1F9D6}-\u{1F9DD}]|[\u{1F46F}\u{1F93C}\u{1F9DE}\u{1F9DF}]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55\u{1F004}\u{1F0CF}\u{1F18E}\u{1F191}-\u{1F19A}\u{1F201}\u{1F21A}\u{1F22F}\u{1F232}-\u{1F236}\u{1F238}-\u{1F23A}\u{1F250}\u{1F251}\u{1F300}-\u{1F320}\u{1F32D}-\u{1F335}\u{1F337}-\u{1F37C}\u{1F37E}-\u{1F384}\u{1F386}-\u{1F393}\u{1F3A0}-\u{1F3C1}\u{1F3C5}\u{1F3C6}\u{1F3C8}\u{1F3C9}\u{1F3CF}-\u{1F3D3}\u{1F3E0}-\u{1F3F0}\u{1F3F8}-\u{1F407}\u{1F409}-\u{1F414}\u{1F416}-\u{1F43A}\u{1F43C}-\u{1F43E}\u{1F440}\u{1F444}\u{1F445}\u{1F451}-\u{1F465}\u{1F46A}\u{1F479}-\u{1F47B}\u{1F47D}-\u{1F480}\u{1F484}\u{1F488}-\u{1F4A9}\u{1F4AB}-\u{1F4FC}\u{1F4FF}-\u{1F53D}\u{1F54B}-\u{1F54E}\u{1F550}-\u{1F567}\u{1F5A4}\u{1F5FB}-\u{1F644}\u{1F648}-\u{1F64A}\u{1F680}-\u{1F6A2}\u{1F6A4}-\u{1F6B3}\u{1F6B7}-\u{1F6BF}\u{1F6C1}-\u{1F6C5}\u{1F6D0}-\u{1F6D2}\u{1F6D5}-\u{1F6D7}\u{1F6EB}\u{1F6EC}\u{1F6F4}-\u{1F6FC}\u{1F7E0}-\u{1F7EB}\u{1F90D}\u{1F90E}\u{1F910}-\u{1F917}\u{1F91D}\u{1F920}-\u{1F925}\u{1F927}-\u{1F92F}\u{1F93A}\u{1F93F}-\u{1F945}\u{1F947}-\u{1F976}\u{1F978}\u{1F97A}-\u{1F9B4}\u{1F9B7}\u{1F9BA}\u{1F9BC}-\u{1F9CB}\u{1F9D0}\u{1F9E0}-\u{1F9FF}\u{1FA70}-\u{1FA74}\u{1FA78}-\u{1FA7A}\u{1FA80}-\u{1FA86}\u{1FA90}-\u{1FAA8}\u{1FAB0}-\u{1FAB6}\u{1FAC0}-\u{1FAC2}\u{1FAD0}-\u{1FAD6}]/gu;
}

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
            res += "&" + key + "=" + sjisUrlEncode(param[key]);
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
        const $elem = $("<div></div>");
        $.each(board.threadList, function() {
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