import ObjectAssign from 'object-assign';

export default function() {
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schema-object
  const schemaObject = ObjectAssign({}, this.opts.schemaobject);
  this.schemaObject = schemaObject;
  this.itemsObject = schemaObject.items;
  this.properties = schemaObject.properties;
  this.required = schemaObject.required;
  this.type = schemaObject.type;

  // @see: http://json-schema.org/latest/json-schema-core.html#rfc.section.4.2
  // ParameterObject/SchemaObject/ItemsObjectのどれを使用するか。
  this.isFormMode = false;
  this.isPropertiesMode = false;
  this.isItemsMode = false;
  switch (this.type) {
  case 'null':
  case 'boolean':
  case 'number':
  case 'integer':
  case 'string':
    this.isFormMode = true;
    break;
  case 'object':
    this.isPropertiesMode = true;
    break;
  case 'array':
    this.isItemsMode = true;
    break;
  default:
    // JSON Schema仕様拡張時にここに到達するがサポートしない。
    break;
  }

  // formが変更された時の処理。
  this.handleFormChange = newValue => {
    this.opts.onchange(newValue);
  };

  // propertiesが変更された時の処理。
  this.handlePropertiesChange = newValue => {
    this.opts.onchange(newValue);
  };

  // itemsが変更された時の処理。
  this.handleItemsChange = newValue => {
    this.opts.onchange(newValue);
  };
}
