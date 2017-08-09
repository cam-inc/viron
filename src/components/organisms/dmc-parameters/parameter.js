import ObjectAssign from 'object-assign';

export default function() {
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#fixed-fields-7
  const parameterObject = ObjectAssign({}, this.opts.parameterobject);
  this.parameterObject = parameterObject;
  // `in`値が`body`の時だけschemaObjectが存在。
  this.schemaObject = parameterObject.schema;
  // `type`値が`array`の時だけitemsObjectが存在。
  this.items = parameterObject.items;// Required if type is 'array'.
  this.name = parameterObject.name;
  this._in = parameterObject.in;
  this.description = parameterObject.description;
  this.required = parameterObject.required;
  // `in`値が`body`以外の時だけtypeが存在。
  this.type = parameterObject.type;

  // ParameterObject/SchemaObject/ItemsObjectのどれを使用するか。
  this.isFormMode = false;
  this.isSchemaMode = false;
  this.isItemsMode = false;
  if (this._in === 'body') {
    this.isSchemaMode = true;
  } else if (this.type === 'array') {
    this.isItemsMode = true;
  } else {
    this.isFormMode = true;
  }

  // infoの開閉状態。
  this.isInfoOpened = false;
  // bodyの開閉状態。
  this.isBodyOpened = true;

  // infoの開閉ボタンがタップされた時の処理。
  this.handleInfoOpenShutButtonTap = () => {
    this.isInfoOpened = !this.isInfoOpened;
    this.update();
  };

  // infoの開閉ボタンがタップされた時の処理。
  this.handleBodyOpenShutButtonTap = () => {
    this.isBodyOpened = !this.isBodyOpened;
    this.update();
  };

  // form入力値が変更された時の処理。
  this.handleFormChange = newValue => {
    this.opts.onchange(this.parameterObject, newValue);
  };

  // items入力値が変更された時の処理。
  this.handleItemsChange = newValue => {
    this.opts.onchange(this.parameterObject, newValue);
  };

  // schema入力値が変更された時の処理。
  this.handleSchemaChange = newValue => {
    this.opts.onchange(this.parameterObject, newValue);
  };
}
