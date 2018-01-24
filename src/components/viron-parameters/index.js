import isUndefined from 'mout/lang/isUndefined';
import contains from 'mout/object/contains';
import forOwn from 'mout/object/forOwn';

export default function() {

  /**
   * 入力値が変更された時の処理。
   * @param {String} key
   * @param {*} newVal
   */
  this.handleValChange = (key, newVal) => {
    if (!this.opts.onchange) {
      return;
    }
    const ret = this.opts.val;
    ret[key] = newVal;
    // 値がundefinedのkeyを削除する。
    forOwn(ret, (val, key) => {
      if (isUndefined(val)) {
        delete ret[key];
      }
    });
    this.opts.onchange(ret);
  };

  /**
   * バリデートされた時の処理。
   * @param {String} formId
   * @param {Boolean} isValid
   */
  const validateResults = {};
  this.handleValValidate = (formId, isValid) => {
    validateResults[formId] = isValid;
    if (!this.opts.onvalidate) {
      return;
    }
    if (contains(validateResults, false)) {
      this.opts.onvalidate(false);
    } else {
      this.opts.onvalidate(true);
    }
  };
}
