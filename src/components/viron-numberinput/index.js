import clipboard from 'clipboard-js';
import isNaN from 'mout/lang/isNaN';
import isNull from 'mout/lang/isNull';
import _isNumber from 'mout/lang/isNumber';
import isString from 'mout/lang/isString';
import isUndefined from 'mout/lang/isUndefined';

export default function() {
  const store = this.riotx.get();

  // クリップボードコピーをサポートしているか否か。
  let isClipboardCopySupported = true;
  // モバイル用レイアウトか否か。
  this.isMobile = store.getter('layout.isMobile');

  /**
   * moutの`isNumber`のラッパー関数。
   * moutの`isNumber`にNaNを渡すと`true`が返却される(想定外)ので、NaNでも`false`を返すように調整しています。
   * @param {*} num
   */
  const isNumber = num => {// eslint-disable-line no-unused-vars
    if (isNaN(num)) {
      return false;
    }
    return _isNumber(num);
  };

  /**
   * 数値もしくはnullに変換します。
   * @param {String|Number|null|undefined} value
   * @return {Number|null}
   */
  this.normalizeValue = value => {
    // nullの場合はそのまま扱う。
    if (isNull(value)) {
      return value;
    }

    // undefined時はnullとして扱う。
    if (isUndefined(value)) {
      return null;
    }

    // 文字列を受け取った場合は形式によって返却値が変わる。
    if (isString(value)) {
      // 数字と`-`と`.`のみも文字列に変換する。
      value = value.replace(/[^-^0-9]/g, '');
      // 空文字列の場合はnullとして扱う。
      if (!value.length) {
        return null;
      }
      // 数値に変換する。
      // `-12` -> -12
      // `1.2` -> 1.2
      // `1.0` -> 1
      // `0012` -> 12
      // `1-2` ->  NaN
      value = Number(value);
      // NaNはnullとして扱う。
      if (isNaN(value)) {
        return null;
      }
    }
    // この時点で`value`は必ずNumberとなる。
    return value;
  };

  this.handleTap = () => {
    this.refs.input.focus();
  };

  this.handleFormSubmit = e => {
    e.preventDefault();
    // Stop evnet propagation becasuse some methods are maybe reserved word for component usage side.
    e.stopPropagation();
    const newVal = this.normalizeValue(this.opts.val);
    const id = this.opts.id;
    if (this.opts.onchange) {
      this.opts.onchange(newVal, id);
    }
    if (this.opts.onsubmit) {
      this.opts.onsubmit(newVal, id);
    }
    const input = this.refs.input;
    if (this.refs.input) {
      // Unforcus on input.
      input.blur();
    }
  };

  // `blur`時にも`change`イベントが発火する。
  // 不都合な挙動なのでイベント伝播を止める。
  this.handleInputChange = e => {
    e.stopPropagation();
  };

  this.handleInputInput = e => {
    if (!this.opts.onchange) {
      return;
    }
    const newVal = this.normalizeValue(e.target.value);
    this.opts.onchange(newVal, this.opts.id);
  };

  this.handleInputFocus = () => {
    if (!this.opts.onfocus) {
      return;
    }
    this.opts.onfocus();
  };

  this.handleInputBlur = () => {
    if (!this.opts.onblur) {
      return;
    }
    this.opts.onblur();
  };

  this.handleBlockerTap = e => {
    e.stopPropagation();
    if (this.isMobile || !isClipboardCopySupported || !isNumber(this.opts.val)) {
      return;
    }
    Promise
      .resolve()
      .then(() => {
        return clipboard.copy(String(this.opts.val));
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
