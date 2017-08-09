import ObjectAssign from 'object-assign';

export default function() {
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schema-object
  const schemaObject = ObjectAssign({}, this.opts.schemaobject);

  // 単一フォームか複数か。
  this.isSingleForm = true;

  // @see: http://json-schema.org/latest/json-schema-core.html#rfc.section.4.2
  switch (schemaObject.type) {
  case 'null':
  case 'boolean':
  case 'number':
  case 'integer':
  case 'string':
    this.isSingleForm = true;
    break;
  case 'object':
  case 'array':
    this.isSingleForm = false;
    break;
  default:
    // JSON Schema仕様拡張時にここに到達するがサポートしない。
    break;
  }
}
