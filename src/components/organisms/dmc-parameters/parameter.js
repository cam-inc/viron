import ObjectAssign from 'object-assign';

export default function() {
  const parameterObject = ObjectAssign({}, this.opts.parameterobject);
  this.parameterObject = parameterObject;
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#fixed-fields-7
  this.name = parameterObject.name;
  this._in = parameterObject.in;// 'query', 'header', 'path', 'formData' or 'body'.
  this.description = parameterObject.description;
  this.required = parameterObject.required;
  // 以下、`in`値によって存在するkeyが変わる。
  // `in`値が`body`の時だけschemaObjectが存在。
  this.schema = parameterObject.schema;
  // `in`値が`body`以外の時だけ以下値群が存在。
  this.type = parameterObject.type;// 'string', 'number', 'integer', 'boolean', 'array' or 'file'.
  this.format = parameterObject.format;
  this.allowEmptyValue = parameterObject.allowEmptyValue;
  this.items = parameterObject.items;// Required if type is 'array'.
  this.collectionFormat = parameterObject.collectionFormat;
  this._default = parameterObject.default;
  this.maximum = parameterObject.maximum;
  this.exclusiveMaximum = parameterObject.exclusiveMaximum;
  this.minimum = parameterObject.minimum;
  this.exclusiveMinimum = parameterObject.exclusiveMinimum;
  this.maxLength = parameterObject.maxLength;
  this.minLength = parameterObject.minLength;
  this.pattern = parameterObject.pattern;
  this.maxItems = parameterObject.maxItems;
  this.minItems = parameterObject.minItems;
  this.uniqueItems = parameterObject.uniqueItems;
  this.enum = parameterObject.enum;
  this.multipleOf = parameterObject.multipleOf;
  // TODO: ParameterObjectも`x-*`でカスタムできる。
  // TODO: `x-param-for`
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#patterned-fields-2

  // schemaObject参照が必要か否か。
  this.isSchemaMode = (this._in === 'body');

  // 単一の入力フォームか複数か。
  this.isSingleForm = true;
  switch (this.type) {
  case 'string':
  case 'number':
  case 'integer':
  case 'boolean':
  case 'file':
    this.isSingleForm = true;
    break;
  case 'array':
    this.isSingleForm = false;
    break;
  default:
    // OpenAPI Documentが正しければここに処理が来ることはない。
    // `in`が`body`の時はここに来るけど、tagが表示されないのでOK。
    break;
  }

  // 入力値が変更された時の処理。
  this.handleParameterChange = newValue => {
    this.opts.onchange(this.parameterObject, newValue);
  };

  // 入力値が変更された時の処理。
  this.handleSchemaChange = newValue => {
    this.opts.onchange(this.parameterObject, newValue);
  };
}
