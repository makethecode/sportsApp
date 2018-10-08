/**
 * Created by dingyiming on 2017/2/16.
 */
/**
 * "yyyy-MM-dd hh:mm:ss
 *
 */
let EmojiFilter= {

    filter: (source) => {

        if (!containsEmoji(source)) {
            return source;//如果不包含，直接返回
        }

        var buf = "";//该buf保存非emoji的字符
        var len = source.length;
        for (var i = 0; i < len; i++) {
            var codePoint = source.charAt(i);
            if (notisEmojiCharacter(codePoint)) {
                if (buf == "") {
                    buf = codePoint;
                }else{
                buf = buf + codePoint;}
            }
        }
        if (buf == null) {
            return "";//如果没有找到非emoji的字符，则返回无内容的字符串
        } else {
            if (buf.length == len) {
                buf = null;
                return source;
            } else {
                return buf.toString();
            }
        }
    }
}

function containsEmoji(source){
    var len = source.length;
    for (var i = 0; i < len; i++) {
        var codePoint = source.charAt(i);
        if (!notisEmojiCharacter(codePoint)) {
            //判断确认有表情字符
            return true;
        }
    }
    return false;
}

function notisEmojiCharacter(codePoint){
    //返回false表示是emoji
    return (codePoint == 0x0) || (codePoint == 0x9) || (codePoint == 0xA) || (codePoint == 0xD) ||
        ((codePoint >= 0x20) && (codePoint <= 0xD7FF)) ||
        ((codePoint >= 0xE000) && (codePoint <= 0xFFFD)) ||
        ((codePoint >= 0x10000) && (codePoint <= 0x10FFFF));
}

module.exports=EmojiFilter;
