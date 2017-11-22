import append from 'mout/array/append';
import contains from 'mout/array/contains';
import deepClone from 'mout/lang/deepClone';
import isArray from 'mout/lang/isArray';
import isObject from 'mout/lang/isObject';
import isUndefined from 'mout/lang/isUndefined';
import forOwn from 'mout/object/forOwn';
import size from 'mout/object/size';
import ObjectAssign from 'object-assign';

export default function() {
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject
  // schemaObjectは
  // JSON Schema: http://json-schema.org/
  // をベースとして作られている。
  // 詳しくは
  // - [JSON Schema Core](https://tools.ietf.org/html/draft-zyp-json-schema-04)
  // - [JSON Schema Validation](https://tools.ietf.org/html/draft-fge-json-schema-validation-00)
  // を参考に。
  // OAS2.0ではitems,allOf,properties,additionalProperties等のsubsetと拡張/追加している。
  const schemaObject = this.schemaObject = this.opts.schemaobject;

  // 全体のタイトル。
  // 必須ならば米印を付ける。
  this.title = schemaObject.description || this.opts.name;
  if (this.opts.required) {
    this.title = `${this.title} *`;
  }

  // データタイプ。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.2
  // JSON Schemaの仕様に沿う。
  // primitive typesは"array","boolean","integer","number","null","object","string"の7つと定義されている。
  // typeは文字列または配列。
  // TODO: 複数type対応すること。
  this.type = null;
  if (isArray(schemaObject.type)) {
    this.type = schemaObject.type[0];
  } else {
    this.type = schemaObject.type;
  }
  // 入れ子構造か否か。
  this.isMulti = contains(['object', 'array'], this.type);
  // Form表示するか否か。
  this.isFormMode = contains(['boolean', 'integer', 'number', 'null', 'string'], this.type);
  // Schema群表示するか否か。
  this.isSchemaMode = (this.type === 'object');
  // Items表示するか否か。
  this.isItemsMode = (this.type === 'array');

  /**
   * 単一Propertyのvalueを返します。
   * @param {String} key
   * @return {*}
   */
  this.getPropertyValue = key => {
    if (!isObject(this.opts.val)) {
      return undefined;
    }
    return this.opts.val[key];
  };

  /**
   * 単一Propertyがrequiredか確認します。
   * @param {String} key
   * @return {Boolean}
   */
  this.isPropertyRequired = key => {
    return contains(schemaObject.required || [], key);
  };

  /**
   * Form表示用のオブジェクトを返します。
   * @return {Object}
   */
  this.getFormData = () => {
    const formData = ObjectAssign({}, schemaObject, {
      name: this.opts.name,
      required: this.opts.required
    });
    return formData;
  };

  /**
   * ItemsObjectのtypeが`schema` `items` `form`がチェックします。
   * @param {String} mode 'schema' 'items' or 'form'
   * @return {Boolean}
   */
  this.isItemsType = mode => {
    let ret = false;
    const type = schemaObject.items.type;
    switch (mode) {
    case 'form':
      ret = contains(['boolean', 'integer','number', 'null', 'string'], type);
      break;
    case 'schema':
      ret = (type === 'object');
      break;
    case 'items':
      ret = (type === 'array');
      break;
    default:
      ret = false;
      break;
    }
    return ret;
  };

  /**
   * itemsの要素のSchemaObjectを返します。
   * @return {Object}
   */
  this.getItemsObject = () => {
    return schemaObject.items;
  };

  /**
   * itemsの要素の名前を返します。
   * @param {Number} idx
   * @return {Object}
   */
  this.getItemName = idx => {
    return `${this.title}[${idx}]`;
  };

  /**
   * plusボタンがタップされた時の処理。
   */
  this.handlePlusButtonTap = () => {
    // 要素を追加します。
    let newVal = deepClone(this.opts.val);
    // 未定義なら空配列を生成する。
    if (isUndefined(newVal)) {
      newVal = [];
    }
    const items = schemaObject.items;
    // type値によって作成する要素を分ける。
    // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#items-object
    // typeは"string", "number", "integer", "boolean", or "array"のいずれかと書いてあるが、"null"と"object"もプラスで想定する。
    // 追加分は先頭に。
    switch (items.type) {
    case 'string':
    case 'number':
    case 'integer':
    case 'boolean':
    case 'null':
      newVal = append([undefined], newVal);
      break;
    case 'object':
      newVal = append([{}], newVal);
      break;
    case 'array':
      newVal = append([[]], newVal);
      break;
    default:
      break;
    }
    this.opts.onchange(this.opts.identifier, newVal);
  };

  /**
   * form: 入力値が変更された時の処理。
   * @param {String} key
   * @param {*} newValue
   */
  this.handleFormChange = (key, newValue) => {
    if (!this.opts.onchange) {
      return;
    }
    this.opts.onchange(this.opts.identifier, newValue);
  };

  /**
   * property: 入力値が変更された時の処理。
   * typeがobjectの時のみヒットします。
   * @param {String} key
   * @param {*} newValue
   */
  this.handlePropertyChange = (key, newValue) => {
    if (!this.opts.onchange) {
      return;
    }
    let ret = !!this.opts.val ? deepClone(this.opts.val) : {};
    ret[key] = newValue;
    // 値がundefinedのkeyを削除する。
    forOwn(ret, (val, key) => {
      if (isUndefined(val)) {
        delete ret[key];
      }
    });
    if (!size(ret)) {
      ret = undefined;
    }
    this.opts.onchange(this.opts.identifier, ret);
  };

  /**
   * item: 入力値が変更された時の処理。
   * typeがarrayの時のみヒットします。
   * @param {Number} idx
   * @param {*} newValue
   */
  this.handleItemChange = (idx, newValue) => {
    if (!this.opts.onchange) {
      return;
    }
    const ret = deepClone(this.opts.val);
    ret[idx] = newValue;
    this.opts.onchange(this.opts.identifier, ret);
  };

}
