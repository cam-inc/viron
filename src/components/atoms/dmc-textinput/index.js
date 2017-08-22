export default function() {
  this.on('updated', () => {
    this.refs.input.value = this.opts.text;
  });
  
  this.handleTap = () => {
    this.refs.form.focus();
  };

  this.handleFormSubmit = e => {
    e.preventDefault();
    this.opts.onchange && this.opts.onchange(this.opts.text, this.opts.id);
  };

  // `blur`時に`change`イベントが発火する等、`change`イベントでは不都合が多い。
  // そのため、`input`イベントを積極的に使用する。
  this.handleInputInput = e => {
    e.preventUpdate = true;
    const newText = e.target.value.replace(/　/g, ' ');// eslint-disable-line no-irregular-whitespace
    this.opts.onchange && this.opts.onchange(newText, this.opts.id);
  };

  this.handleInputChange = e => {
    // `blur`時に`change`イベントが発火する。
    // 不都合な挙動なのでイベント伝播を止める。
    e.stopPropagation();
  };
}
