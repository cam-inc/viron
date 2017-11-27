import contains from 'mout/array/contains';
import deepClone from 'mout/lang/deepClone';

export default function() {
  const parameterObject = this.parameterObject = this.opts.parameterobject;

  // Form関連。
  this.isFormMode = false;
  this.formObject = null;
  // Properties関連。
  this.isPropertiesMode = false;
  this.propertiesObject = null;
  this.propertiesLabel = null;
  // Items関連。
  this.isItemsMode = false;
  this.itemsObject = null;
  this.itemsLabel = null;

  // 各変数を設定。
  // `in`の値は"query", "header", "path", "formData", "body"のいずれか。
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#parameter-object
  if (contains(['query', 'header', 'path', 'formData'], parameterObject.in)) {
    // `in`が`body`以外の場合、typeは必ず"string", "number", "integer", "boolean", "array", "fileのいずれかになる。
    if (contains(['string', 'number', 'integer', 'boolean', 'file'], parameterObject.type)) {
      this.isFormMode = true;
      const formObject = deepClone(parameterObject);
      delete formObject.in;
      this.formObject = formObject;
    } else {
      // typeがarrayの場合。
      this.isItemsMode = true;
      const itemsObject = deepClone(parameterObject.items);
      this.itemsObject = itemsObject;
      this.itemsLabel = parameterObject.description || parameterObject.name;
    }
  } else {
    // inがbodyの場合。
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.2
    // primitive typesは"array","boolean","integer","number","null","object","string"の7つと定義されている。
    const schema = parameterObject.schema;
    if (contains(['boolean', 'integer', 'number', 'null', 'string'], schema.type)) {
      this.isFormMode = true;
      const formObject = deepClone(parameterObject.schema);
      this.formObject = formObject;
    } else if (schema.type === 'object') {
      this.isPropertiesMode = true;
      const propertiesObject = deepClone(schema);
      this.propertiesObject = propertiesObject;
      this.propertiesLabel = parameterObject.description || parameterObject.name;
    } else {
      // typeがarrayの場合。
      this.isItemsMode = true;
      const itemsObject = deepClone(schema.items);
      this.itemsObject = itemsObject;
      this.itemsLabel = parameterObject.description || parameterObject.name;
    }
  }

  /**
   * Parameterが変更された時の処理。
   * @param {String} key
   * @param {*} newVal
   */
  this.handleValChange = (key, newVal) => {
    if (!this.opts.onchange) {
      return;
    }
    // keyはopts.parameterObject.nameと同じ。
    this.opts.onchange(key, newVal);
  };
}
