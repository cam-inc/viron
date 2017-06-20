export default function() {
  this.handleTap = () => {
    this.refs.form.focus();
  };

  // `blur`時に`change`イベントが発火する等、`change`イベントでは不都合が多い。
  // そのため、`input`イベントを積極的に使用する。
  this.handleTextareaInput = e => {
    const newText = e.target.value.replace(/　/g, ' ');// eslint-disable-line no-irregular-whitespace
    this.opts.onchange && this.opts.onchange(newText);
  };

  this.handleTextareaChange = e => {
    // `blur`時に`change`イベントが発火する。
    // 不都合な挙動なのでイベント伝播を止める。
    e.stopPropagation();
  };

  this.handleInputFocus = () => {
    this.opts.onfocustoggle && this.opts.onfocustoggle(true);
  };

  this.handleInputBlur = () => {
    this.opts.onfocustoggle && this.opts.onfocustoggle(false);
  };
}
