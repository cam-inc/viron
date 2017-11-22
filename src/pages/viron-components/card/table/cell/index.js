import contains from 'mout/array/contains';
import isArray from 'mout/lang/isArray';
import isBoolean from 'mout/lang/isBoolean';
import isNull from 'mout/lang/isNull';
import isNumber from 'mout/lang/isNumber';
import isObject from 'mout/lang/isObject';
import isString from 'mout/lang/isString';

export default function() {
  // メディア系か否か。
  this.isMedia = false;
  // 画像系か否か。
  this.isImage = false;
  // typeに応じて表示を切り替えます。
  this.value = (() => {
    const data = this.opts.data;
    if (isNull(data)) {
      return 'null';
    }
    if (isBoolean(data)) {
      return (data ? 'true' : 'false');
    }
    if (isNumber(data)) {
      return String(data);
    }
    if (isArray(data) || isObject(data)) {
      return 'TODO';
    }
    if (isString(data)) {
      // 拡張子から最適な表示方法を推測します。
      const split = data.split('.');
      if (split.length < 2) {
        // 拡張子がなければそのまま表示する。
        return data;
      }
      const suffix = split[split.length - 1];
      // 画像系チェック。
      if (contains(['png', 'jpg', 'gif'], suffix)) {
        this.isMedia = true;
        this.isImage = true;
        return data;
      }
      // TODO: 動画系もチェックすること。
      // 推測できない場合はそのまま表示。
      return data;
    }
    return data;
  })();
}
