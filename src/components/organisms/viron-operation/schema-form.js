import contains from 'mout/array/contains';
import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
import ObjectAssign from 'object-assign';

export default function() {
  // typeは'null', 'boolean', 'object', 'array', 'number', 'integer', or 'string'.
  // @see: https://swagger.io/specification/#dataTypeFormat
  const type = this.opts.parameterobject.type;
  const format = this.opts.parameterobject.format;
  this.uiType = null;
  this.multiSchema = null;
  this.multiData = null;
  this.multiPropertyKeys = null;
  if (!!this.opts.parameterobject.enum) {
    this.uiType = 'select';
  } else {
    switch (type) {
    case 'string':
      if (format === 'byte') {
        this.uiType = 'uploader';
      } else if (format === 'date' || format === 'date-time') {
        // TODO: datepicker表示
        //this.uiType = 'datepicker';
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
      this.uiType = 'multi';
      if (this.opts.parametervalue) {
        this.multiData = this.opts.parametervalue;
      }
      this.multiSchema = this.opts.parameterobject.items;
      this.multiPropertyKeys = Object.keys(this.opts.parameterobject.items.properties);
      break;
    case 'object':
    case 'null':
    default:
      break;
    }
  }

  this.getParameterObject = propertyKey => {
    return ObjectAssign({}, this.multiSchema.properties[propertyKey], {
      name: propertyKey,
      required : contains(this.multiSchema.required, propertyKey)
    });
  };

  this.getValue = (propertyKey, idx) => {
    if (!this.multiData[idx][propertyKey]) {
      return;
    }
    return this.multiData[idx][propertyKey];
  };

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

  this.change = value => {
    // TODO: format, validate
    // TODO: byteならbase64化する
    if (this.opts.parameterobject.type === 'number' || this.opts.parameterobject.type === 'integer') {
      value = Number(value);
    }
    this.opts.onchange(this.opts.parameterobject.name, value, this.opts.multiidx);
  };

  this.handleMultiPlusButtonClick = () => {
    this.multiData = this.multiData || [];
    this.multiData.push({});
    this.change(this.multiData);
  };

  this.handleMultiMinusButtonClick = e => {
    this.multiData.splice(Number(e.currentTarget.getAttribute('idx')), 1);
    this.change(this.multiData);
  };

  this.handleInputChange = value => {
    this.change(value);
  };

  this.handleCheckboxChange = isChecked => {
    this.change(isChecked);
  };

  this.handleSelectChange = options => {
    const option = find(options, option => {
      return option.isSelected;
    });
    const value = (option ? option.label : undefined);
    this.change(value);
  };

  this.handleMultiChange = (key, value, idx) => {
    if (value === undefined || idx === undefined) {
      // TODO: 原因調査
      return;
    }
    this.multiData[idx][key] = value;
    this.change(this.multiData);
  };
}
