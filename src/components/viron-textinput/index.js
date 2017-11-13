import isString from 'mout/lang/isString';

export default function() {
  /**
   * 文字列もしくはnullに変換します。
   * @param {String|null|undefined} value
   * @return {String|null}
   */
  this.normalizeValue = value => {
    if (!isString(value)) {
      return null;
    }
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
}
