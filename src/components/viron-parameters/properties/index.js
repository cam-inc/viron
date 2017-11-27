import contains from 'mout/array/contains';
import deepClone from 'mout/lang/deepClone';
import isObject from 'mout/lang/isObject';
import isUndefined from 'mout/lang/isUndefined';
import forOwn from 'mout/object/forOwn';
import size from 'mout/object/size';

export default function() {
  // PropertiesObject = typeがobjectであるSchemaObject。
  const propertiesObject = this.propertiesObject = this.opts.propertiesobject;

  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.2
  // primitive typesは"array","boolean","integer","number","null","object","string"の7つと定義されている。
  /**
   * Form表示か否かを判定します。
   * @param {Object} property
   * @return {Boolean}
   */
  this.isFormMode = property => {
    return contains(['boolean', 'integer', 'number', 'null', 'string'], property.type);
  };

  /**
   * Properties表示か否かを判定します。
   * @param {Object} property
   * @return {Boolean}
   */
  this.isPropertiesMode = property => {
    return (property.type === 'object');
  };

  /**
   * Items表示か否かを判定します。
   * @param {Object} property
   * @return {Boolean}
   */
  this.isItemsMode = property => {
    return (property.type === 'array');
  };

  /**
   * 対象keyに対するvalueを返します。
   * opts.valがundefinedなら返り値もundefinedになります。
   * @param {String} key
   * @return {*}
   */
  this.getVal = key => {
    if (!isObject(this.opts.val)) {
      return undefined;
    }
    return this.opts.val[key];
  };

  /**
   * FormObjectに変換します。
   * @param {String} key
   * @param {Object} property
   * @return {Object}
   */
  this.getFormObject = (key, property) => {
    const ret = deepClone(property);
    ret.name = key;
    ret.required = contains(propertiesObject.required, key);
    return ret;
  };

  /**
   * PropertiesObjectに変換します。
   * @param {String} key
   * @param {Object} property
   * @return {Object}
   */
  this.getProperiesObject = (key, property) => {
    const ret = deepClone(property);
    return ret;
  };

  /**
   * ItemsObjectに変換します。
   * @param {String} key
   * @param {Object} property
   * @return {Object}
   */
  this.getItemsObject = (key, property) => {
    const ret = deepClone(property);
    return ret.items;
  };

  /**
   * 指定keyがrequiredか否か調べます。
   * @param {String} key
   * @return {Boolean}
   */
  this.getRequired = key => {
    return contains(propertiesObject.required, key);
  };

  /**
   * 各propertyが変更された時の処理。
   * @param {String} key
   * @param {*} newVal
   */
  this.handlePropertyChange = (key, newVal) => {
    if (!this.opts.onchange) {
      return;
    }
    let ret = this.opts.val || {};
    ret[key] = newVal;
    // 値がundefinedのkeyを削除する。
    forOwn(ret, (val, key) => {
      if (isUndefined(val)) {
        delete ret[key];
      }
    });
    // TODO: オブジェクトが空の場合はどーする？
    if (!size(ret)) {
      ret = undefined;
    }
    this.opts.onchange(this.opts.identifier, ret);
  };
}
