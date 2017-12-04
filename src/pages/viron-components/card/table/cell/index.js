import clipboard from 'clipboard-js';
import contains from 'mout/array/contains';
import isArray from 'mout/lang/isArray';
import isBoolean from 'mout/lang/isBoolean';
import isNull from 'mout/lang/isNull';
import isNumber from 'mout/lang/isNumber';
import isObject from 'mout/lang/isObject';
import isString from 'mout/lang/isString';
import isUndefined from 'mout/lang/isUndefined';

export default function() {
  const store = this.riotx.get();

  // クリップっボードコピーをサポートしているか否か。
  let isClipboardCopySupported = true;
  // テキスト系か否か。
  this.isText = false;
  // 画像系か否か。
  this.isImage = false;
  // base64系か否か。
  this.isBase64 = false;
  // 動画系か否か。
  this.isVideo = false;
  this.videoType = null;
  // typeに応じて表示を切り替えます。
  this.value = (() => {

    const data = this.opts.data;
    if (isNull(data)) {
      this.isText = true;
      return 'null';
    }
    if (isBoolean(data)) {
      this.isText = true;
      return (data ? 'true' : 'false');
    }
    if (isNumber(data)) {
      this.isText = true;
      return String(data);
    }
    if (isArray(data)) {
      this.isText = true;
      return '[...]';
    }
    if (isObject(data)) {
      this.isText = true;
      return '{...}';
    }
    if (isString(data)) {
      // base64から画像とする。
      // TODO: format値は'image' 'image/jpg'とかの方がベターかも。
      if (this.opts.column.format === 'base64') {
        this.isBase64 = true;
        return data;
      }
      // 拡張子から最適な表示方法を推測します。
      const split = data.split('.');
      if (split.length < 2) {
        // 拡張子がなければそのまま表示する。
        this.isText = true;
        return data;
      }
      const suffix = split[split.length - 1];
      // 画像系チェック。
      if (contains(['png', 'jpg', 'gif'], suffix)) {
        this.isImage = true;
        return data;
      }
      // 動画系チェック。
      if (contains(['mp4', 'ogv', 'webm'], suffix)) {
        this.isVideo = true;
        this.videoType = suffix;
        return data;
      }
      // 推測できない場合はそのまま表示。
      this.isText = true;
      return data;
    }
    if (isUndefined(data)) {
      this.isText = true;
      return '';
    }
    // それ以外。強制的に文字列化。
    this.isText = true;
    return String(data);
  })();

  this.handleStringTap = e => {
    if (!isClipboardCopySupported) {
      return;
    }
    e.stopPropagation();
    Promise
      .resolve()
      .then(() => {
        return clipboard.copy(this.value);
      })
      .then(() => store.action('toasts.add', {
        message: 'クリップボードへコピーしました。'
      }))
      .catch(() => {
        isClipboardCopySupported = false;
        store.action('toasts.add', {
          type: 'error',
          message: 'ご使用中のブラウザではクリップボードへコピー出来ませんでした。'
        });
      });
  };
}
