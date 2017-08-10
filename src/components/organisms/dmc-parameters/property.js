import ObjectAssign from 'object-assign';

export default function() {
  const schemaObject = ObjectAssign({}, this.opts.property);
  this.schemaObject = schemaObject;

  // schemaが変更された時の処理。
  this.handleSchemaChange = newValue => {
    this.opts.onchange(newValue, this.opts.key);
  };
}
