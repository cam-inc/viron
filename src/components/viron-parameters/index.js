import throttle from 'mout/function/throttle';
import isUndefined from 'mout/lang/isUndefined';
import contains from 'mout/object/contains';
import forOwn from 'mout/object/forOwn';

export default function() {
  // 横幅が狭いか否か。
  this.isNarrow = false;
  const checkNarrow = () => {
    const rootElm = this.root;
    const rect = rootElm.getBoundingClientRect();
    const width = rect.width;
    if (width > 450) {
      this.isNarrow = false;
    } else {
      this.isNarrow = true;
    }
    this.update();
  };

  // resize時にvironアプリケーションの表示サイズを更新します。
  // resizeイベントハンドラーの発火回数を減らす。
  const handleResize = throttle(() => {
    checkNarrow();
  }, 1000);
  this.on('mount', () => {
    window.addEventListener('resize', handleResize);
    checkNarrow();
  }).on('unmount', () => {
    window.removeEventListener('resize', handleResize);
  });

  /**
   * Input when submitted
   * @param {String} key
   * @param {*} newVal
   */
  this.handleValSubmit = (key, newVal) => {
    if (!this.opts.onsubmit) {
      return;
    }
    const ret = this.opts.val;
    ret[key] = newVal;
    // Delete the key if it's undefined.
    forOwn(ret, (val, key) => {
      if (isUndefined(val)) {
        delete ret[key];
      }
    });
    this.opts.onsubmit(ret);
  };

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
