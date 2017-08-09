export default function() {

  this.handleIncreaseButtonPat = () => {
    let number = this.opts.number;
    // numberが空文字/null/undefined/0
    if (!number) {
      number = 0;
    }
    if (number === '-') {
      number = 0;
    }
    this.opts.onchange(Number(number) + (this.opts.step || 1) );
  };

  this.handleDecreaseButtonPat = () => {
    let number = this.opts.number;
    // numberが空文字/null/undefined/0
    if (!number) {
      number = 0;
    }
    if (number === '-') {
      number = 0;
    }
    this.opts.onchange(Number(number) - (this.opts.step || 1) );
  };

  this.handleKeyDown = (e) => {
    switch (e.code) {
    case 'ArrowUp':
      this.handleIncreaseButtonPat();
      break;
    case 'ArrowDown':
      this.handleDecreaseButtonPat();
      break;
    }
  };

  // @see: https://developer.mozilla.org/ja/docs/Web/API/Element/setAttribute
  // setAttribute() を使ってある属性、XUL や HTML の特別な値、および HTML の選択領域の変更は、属性がデフォルト値を特定している場合に一貫性の無い動作となります。現在の値にアクセスしたり、変更したりするにはプロパティを使用すべきです。具体例として、 elt .setAttribute('value', val ) の代わりに elt .value を使用します。
  this.on('updated', () => {
    this.refs.input.value = this.opts.number;
  });

  this.handleInputInput = e => {
    e.preventUpdate = true;
    let newText = e.target.value.replace(/[^-^0-9]/g, '');// eslint-disable-line no-irregular-whitespace
    if(!newText.length || newText.match(/^([-]?[1-9][0-9]*?|-|0)$/)) {
      this.opts.onchange(newText);
    }else {
      this.refs.input.value = this.opts.number;
    }
  };

  this.handleInputChange = e => {
    e.stopPropagation();
  };
}