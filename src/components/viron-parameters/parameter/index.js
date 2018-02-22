import contains from 'mout/array/contains';
import deepClone from 'mout/lang/deepClone';
import util from '../util';

export default function() {
  const parameterObject = this.parameterObject = this.opts.parameterobject;

  // Form関連。
  this.isFormMode = false;
  this.formObject = null;
  this.isFormDisabled = false;
  // Properties関連。
  this.isPropertiesMode = false;
  this.propertiesObject = null;
  this.propertiesLabel = null;
  // Items関連。
  this.isItemsMode = false;
  this.schemaObject = null;
  this.itemsLabel = null;

  // 横幅調整。
  this.spreadStyle = 'spreadSmall';

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
      this.spreadStyle = util.getSpreadStyle(formObject);
      // テーブルのprimaryKeyとnameが一致した場合は、入力フォームを強制的にdisableにします。
      if (parameterObject.in === 'path' && parameterObject.name === this.opts.primary) {
        this.isFormDisabled = true;
      }
    } else {
      // typeがarrayの場合。
      this.isItemsMode = true;
      const schemaObject = deepClone(parameterObject);
      this.schemaObject = schemaObject;
      this.itemsLabel = parameterObject.description || parameterObject.name;
      this.spreadStyle = 'spreadFull';
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
      this.spreadStyle = util.getSpreadStyle(formObject);
    } else if (schema.type === 'object') {
      this.isPropertiesMode = true;
      const propertiesObject = deepClone(schema);
      this.propertiesObject = propertiesObject;
      this.propertiesLabel = parameterObject.description || parameterObject.name;
      this.spreadStyle = 'spreadFull';
    } else {
      // typeがarrayの場合。
      this.isItemsMode = true;
      const schemaObject = deepClone(schema);
      this.schemaObject = schemaObject;
      this.itemsLabel = parameterObject.description || parameterObject.name;
      this.spreadStyle = 'spreadFull';
    }
  }

  /**
   * Parameter when submit
   * @param {String} key
   * @param {*} newVal
   */
  this.handleValSubmit = (key, newVal) => {
    if (!this.opts.onsubmit) {
      return;
    }
    // Key is the same as opts.parameterObject.name.
    this.opts.onsubmit(key, newVal);
  };

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

  /**
   * バリデートされた時の処理。
   * @param {String} formId
   * @param {Boolean} isValid
   */
  this.handleValValidate = (formId, isValid) => {
    if (!this.opts.onvalidate) {
      return;
    }
    this.opts.onvalidate(formId, isValid);
  };
}
