import ObjectAssign from 'object-assign';
import oas from '../../../core/oas';

export default function() {
  const propertyObject = ObjectAssign({}, this.opts.property);
  this.schemaObject = propertyObject;
  this.normalizedSchemaObject = oas.createSchemaObjectFromPropertyObject(propertyObject, {
    key: this.opts.key,
    required: (this.opts._required || []).concat([])
  });

  // schemaが変更された時の処理。
  this.handleSchemaChange = newValue => {
    this.opts.onchange(newValue, this.opts.key);
  };
}
