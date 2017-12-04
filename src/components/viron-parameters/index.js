import isUndefined from 'mout/lang/isUndefined';
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
}
