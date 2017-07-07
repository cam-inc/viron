import forEach from 'mout/array/forEach';

export default function() {
  this.handleFormSubmit = e => {
    e.preventUpdate = true;
    e.preventDefault();
    const selectedIndex = this.refs.select.selectedIndex;
    forEach(this.opts.options, (option, idx) => {
      option.isSelected = (idx === selectedIndex);
    });
    this.opts.onchange && this.opts.onchange(this.opts.options);
  };

  // `blur`時に`change`イベントが発火する等、`change`イベントでは不都合が多い。
  // そのため、`input`イベントを積極的に使用する。
  this.handleInputInput = e => {
    e.preventUpdate = true;
    const selectedIndex = this.refs.select.selectedIndex;
    forEach(this.opts.options, (option, idx) => {
      option.isSelected = (idx === selectedIndex);
    });
    this.opts.onchange && this.opts.onchange(this.opts.options);
  };

  this.handleInputChange = e => {
    // `blur`時に`change`イベントが発火する。
    // 不都合な挙動なのでイベント伝播を止める。
    e.stopPropagation();
  };
}
