import contains from 'mout/array/contains';
import deepClone from 'mout/lang/deepClone';
import isUndefined from 'mout/lang/isUndefined';
import forOwn from 'mout/object/forOwn';

export default function() {
  // デフォルト値を設定。
  // TODO: 参照元を変更しているアンチパターン。
  this.opts.val = this.opts.val || {};

  /**
   * Formを表示するかチェックします。
   * @param {Object} parameterObject
   * @return {Boolean}
   */
  this.isFormMode = parameterObject => {
    // `in`の値は"query", "header", "path", "formData", "body"のいずれか。
    // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#parameter-object
    if (contains(['query', 'header', 'path', 'formData'], parameterObject.in)) {
      // `in`が`body`以外の場合、typeは必ず"string", "number", "integer", "boolean", "array", "fileのいずれかになる。
      if (contains(['string', 'number', 'integer', 'boolean', 'file'], parameterObject.type)) {
        return true;
      }
      // typeがarrayの場合。
      return false;
    }
    // inがbodyの場合。
    return false;
  };

  /**
   * Schemaを表示するかチェックします。
   * @param {Object} parameterObject
   * @return {Boolean}
   */
  this.isSchemaMode = parameterObject => {
    // `in`の値は"query", "header", "path", "formData", "body"のいずれか。
    // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#fixed-fields-7
    // `in`が`body`の時のみschemaが存在する。
    if (parameterObject.in === 'body') {
      return true;
    }
    return false;
  };

  /**
   * 入力値が変更された時の処理。
   * @param {String} key
   * @param {*} newValue
   */
  this.handleValChange = (key, newValue) => {
    if (!this.opts.onchange) {
      return;
    }
    const newVal = deepClone(this.opts.val);
    newVal[key] = newValue;
    // 値がundefinedのkeyを削除する。
    forOwn(newVal, (val, key) => {
      if (isUndefined(val)) {
        delete newVal[key];
      }
    });
    this.opts.onchange(newVal);
  };
}
