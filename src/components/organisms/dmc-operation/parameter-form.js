import find from 'mout/array/find';
import forEach from 'mout/array/forEach';

export default function() {
  const type = this.opts.parameterobject.type;
  // @see: https://swagger.io/specification/#dataTypeFormat
  const format = this.opts.parameterobject.format;
  this.uiType = null;
  this.isOpened = false;
  if (!!this.opts.parameterobject.enum) {
    this.uiType = 'select';
  } else {
    switch (type) {
    case 'string':
      if (format === 'byte') {
        this.uiType = 'uploader';
      } else if (format === 'date' || format === 'date-time') {
        this.uiType = 'datepicker';
      } else {
        this.uiType = 'input';
      }
      break;
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
      this.uiType = 'uploader';
      break;
    default:
      break;
    }
  }

  this.getSelectOptions = () => {
    const options = [];
    if (this.opts.parametervalue === undefined) {
      options.push({
        label: '-- select an option --',
        isSelected: true,
        isDiabled: true
      });
    }
    forEach(this.opts.parameterobject.enum, (v, idx) => {
      options.push({
        id: `select_${idx}`,
        label: v,
        isSelected: (v === this.opts.parametervalue)
      });
    });
    return options;
  };

  this.on('updated', () => {
    this.rebindTouchEvents();
  });

  this.change = value => {
    // TODO: format, validate
    // TODO: byteならbase64化する
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

  this.handleFileChange = file => {
    this.change(file);
  };
}
