import isString from 'mout/lang/isString';

export default function() {
  /**
   * undefined等の値を考慮した最適な値を返します。
   * @param {String|null} value
   * @return {String|null}
   */
  this.normalizeValue = value => {
    if (!isString(value)) {
      return null;
    }
    return value.replace(/　/g, ' ');// eslint-disable-line no-irregular-whitespace
  };

  this.on('mount', () => {
    this.refs.textarea.value = this.normalizeValue(this.opts.text);
    this.opts.onchange(this.normalizeValue(this.opts.text), this.opts.id);
  }).on('updated', () => {
    this.refs.textarea.value = this.normalizeValue(this.opts.text);
  });

  this.handleTap = () => {
    this.refs.form.focus();
  };

  this.handleFormSubmit = e => {
    e.preventDefault();
    this.opts.onchange && this.opts.onchange(this.normalizeValue(this.opts.text), this.opts.id);
  };

  // `blur`時に`change`イベントが発火する等、`change`イベントでは不都合が多い。
  // そのため、`input`イベントを積極的に使用する。
  this.handleTextareaInput = e => {
    e.preventUpdate = true;
    this.opts.onchange && this.opts.onchange(this.normalizeValue(e.target.value), this.opts.id);
  };

  this.handleTextareaChange = e => {
    // `blur`時に`change`イベントが発火する。
    // 不都合な挙動なのでイベント伝播を止める。
    e.stopPropagation();
  };
}
