import ObjectAssign from 'object-assign';
import oas from '../../../core/oas';

export default function() {
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#fixed-fields-7
  const parameterObject = ObjectAssign({}, this.opts.parameterobject);
  this.parameterObject = parameterObject;
  // SchemaObject化したObject。
  this.normalizedSchemaObject = null;
  // ParameterObject/SchemaObject/ItemsObjectのどれを使用するか。
  switch (parameterObject.in) {
  case 'body':
    // `in`値が`body`の時だけschemaObjectが存在。
    this.normalizedSchemaObject = oas.createSchemaObjectFromParameterObjectAndSchemaObject(parameterObject, parameterObject.schema);
    break;
  case 'query':
  case 'header':
  case 'path':
  case 'formData':
    this.normalizedSchemaObject = parameterObject;
    break;
  default:
    break;
  }

  // schema入力値が変更された時の処理。
  this.handleSchemaChange = newValue => {
    this.opts.onchange(this.parameterObject, newValue);
  };
}
