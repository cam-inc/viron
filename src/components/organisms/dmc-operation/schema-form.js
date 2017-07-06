import contains from 'mout/array/contains';
import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
import ObjectAssign from 'object-assign';

export default function() {
  // typeは'null', 'boolean', 'object', 'array', 'number' or 'string'.
  const type = this.opts.parameterobject.type;
  this.uiType = null;
  this.isOpened = false;
  this.multiSchema = null;
  this.multiData = null;
  this.multiPropertyKeys = null;
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
    this.opts.onchange(this.opts.parameterobject.name, value, this.opts.multiidx);
  };

  this.handleMultiPlusButtonTap = () => {
    this.multiData = this.multiData || [];
    this.multiData.push({});
    this.change(this.multiData);
  };

  this.handleMultiMinusButtonTap = e => {
    this.multiData.splice(e.item.idx, 1);
    this.change(this.multiData);
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

  this.handleMultiChange = (key, value, idx) => {
    if (value === undefined || idx === undefined) {
      // TODO: 原因調査
      return;
    }
    this.multiData[idx][key] = value;
    this.change(this.multiData);
  };
}
