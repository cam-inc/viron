import find from 'mout/array/find';
import forEach from 'mout/array/forEach';

export default function() {
  const type = this.opts.parameterobject.type;
  this.uiType = null;
  this.isOpened = false;
  if (!!this.opts.parameterobject.enum) {
    this.uiType = 'select';
  } else {
    switch (type) {
    case 'string':
    case 'number':
    case 'integer':
      this.uiType = 'input';
      break;
    case 'boolean':
      this.uiType = 'checkbox';
      break;
    case 'array':
      this.uiType = 'TODO';
      break;
    case 'file':
      this.uiType = 'TODO';
      break;
    default:
      break;
    }
  }

  this.getSelectOptions = () => {
    const options = [];
    forEach(this.opts.parameterobject.enum, (v, idx) => {
      options.push({
        id: `select_${idx}`,
        label: v,
        isSelected: (v === this.opts.parametervalue)
      });
    });
    return options;
  };

  this.change = value => {
    // TODO: format, validate
    if (this.opts.parameterobject.type === 'number' || this.opts.parameterobject.type === 'integer') {
      value = Number(value);
    }
    this.opts.onchange(this.opts.parameterobject.name, value);
  };

  this.handleInputChange = value => {
    this.change(value);
  };

  this.handleCheckboxChange = isChecked => {
    this.change(isChecked);
  };

  this.handleSelectToggle = isOpened => {
    this.isOpened = isOpened;
    this.update();
  };

  this.handleSelectChange = options => {
    const option = find(options, option => {
      return option.isSelected;
    });
    const value = (option ? option.label : undefined);
    this.change(value);
  };
}
