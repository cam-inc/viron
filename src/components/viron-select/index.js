import forEach from 'mout/array/forEach';
import ObjectAssign from 'object-assign';

export default function() {
  const getNewOptions = () => {
    const selectedIndex = this.refs.select.selectedIndex;
    const newOptions = [];
    forEach(this.opts.options, (option, idx) => {
      newOptions.push(ObjectAssign({}, option, {
        isSelected: (idx === selectedIndex)
      }));
    });
    return newOptions;
  };

  this.handleFormSubmit = e => {
    e.preventDefault();
    if (!this.opts.onchange) {
      return;
    }
    this.opts.onchange(getNewOptions());
  };

  // `blur`時に`change`イベントが発火する等、`change`イベントでは不都合が多い。
  // そのため、`input`イベントを積極的に使用する。
  this.handleSelectInput = () => {
    if (!this.opts.onchange) {
      return;
    }
    this.opts.onchange(getNewOptions());
  };

  this.handleSelectChange = e => {
    // `blur`時に`change`イベントが発火する。
    // 不都合な挙動なのでイベント伝播を止める。
    e.stopPropagation();
  };
}
