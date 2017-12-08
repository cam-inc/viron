import isNaN from 'mout/lang/isNaN';
import isNull from 'mout/lang/isNull';
import _isNumber from 'mout/lang/isNumber';
import isString from 'mout/lang/isString';
import isUndefined from 'mout/lang/isUndefined';

export default function() {
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
    if (!this.opts.onchange) {
      return;
    }
    const newVal = this.normalizeValue(this.opts.val);
    this.opts.onchange(newVal, this.opts.id);
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

  this.handleBlockerTap = e => {
    e.stopPropagation();
  };
}
