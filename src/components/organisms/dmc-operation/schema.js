import contains from 'mout/array/contains';
import forOwn from 'mout/object/forOwn';
import ObjectAssign from 'object-assign';

export default function() {
  this.propertyKeys = Object.keys(this.opts.schema.properties);

  this.getParameterObject = propertyKey => {
    return ObjectAssign({}, this.opts.schema.properties[propertyKey], {
      name: propertyKey,
      required : contains(this.opts.schema.required, propertyKey)
    });
  };

  this.getValue = propertyKey => {
    if (!this.opts.parametervalues) {
      return;
    }
    return this.opts.parametervalues[propertyKey];
  };

  this.handleChange = (name, value) => {
    const values = ObjectAssign({}, this.opts.parametervalues, {
      [name]: value
    });
    forOwn(values, (v, k) => {
      // TODO: deleteするためのもっと良い方法を模索すること。
      if (typeof v === 'string' && !v.length) {
        delete values[k];
      }
    });
    this.opts.onchange(this.opts.name, values);
  };
}
