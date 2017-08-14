import isArray from 'mout/lang/isArray';
import hasOwn from 'mout/object/hasOwn';
import ObjectAssign from 'object-assign';
import oas from '../../../core/oas';

export default function() {
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#fixed-fields-7
  const schemaObject = ObjectAssign({}, this.opts.schemaobject);
  this.schemaObject = schemaObject;
  this.enum = schemaObject.enum;
  this.name = schemaObject.name;
  this.description = schemaObject.description;
  this.required = schemaObject.required;
  this.type = schemaObject.type;
  this.example = schemaObject.example;
  this.multipleOf = hasOwn(schemaObject, 'multipleOf') && String(schemaObject.multipleOf);
  this.maximum = hasOwn(schemaObject, 'maximum') && String(schemaObject.maximum);
  this.exclusiveMaximum = hasOwn(schemaObject, 'exclusiveMaximum') && String(schemaObject.exclusiveMaximum);
  this.minimum = hasOwn(schemaObject, 'minimum') && String(schemaObject.minimum);
  this.exclusiveMinimum = hasOwn(schemaObject, 'exclusiveMinimum') && String(schemaObject.exclusiveMinimum);
  this.maxLength = hasOwn(schemaObject, 'maxLength') && String(schemaObject.maxLength);
  this.minLength = hasOwn(schemaObject, 'minLength') && String(schemaObject.minLength);
  this.pattern = hasOwn(schemaObject, 'pattern') && String(schemaObject.pattern);
  this.format = hasOwn(schemaObject, 'format') && String(schemaObject.format);

  /**
   * バリデートエラー項目群を返します。
   * @return {Array}
   */
  this.getValidateErrors = () => {
    return oas.validate(this.opts.val, schemaObject);
  };

  // @see: http://json-schema.org/latest/json-schema-core.html#rfc.section.4.2
  // ParameterObject/SchemaObject/ItemsObjectのどれを使用するか。
  this.isFormMode = false;
  this.isPropertiesMode = false;
  this.isItemsMode = false;
  this.properties = null;
  this.items = null;
  switch (this.type) {
  case 'null':
  case 'boolean':
  case 'number':
  case 'integer':
  case 'string':
  case 'file':
    this.isFormMode = true;
    break;
  case 'object':
    this.isPropertiesMode = true;
    this.properties = schemaObject.properties;
    break;
  case 'array':
    this.isItemsMode = true;
    this.items = schemaObject.items;
    break;
  default:
    // JSON Schema仕様拡張時にここに到達するがサポートしない。
    break;
  }

  /**
   * propertyを参照してデフォルト値を返します。
   * @param {Object} property
   * @return {*}
   */
  const getDefaultPropertyValue = property => {
    // 上書き予防。
    property = ObjectAssign({}, property);
    let defaultValue;
    let type;
    if (isArray(property.type)) {
      type = property.type[0];
    } else {
      type = property.type;
    }
    switch (type) {
    case 'array':
      defaultValue = [];
      break;
    case 'object':
      defaultValue = {};
      break;
    case 'boolean':
    case 'integer':
    case 'number':
    case 'null':
    case 'string':
    default:
      // 意図的に`undefined`をデフォルト値とする。
      defaultValue = undefined;
      break;
    }
    return defaultValue;
  };

  /**
   * 指定propertyに対応するユーザ入力値を返却します。
   * @param {Object} property
   * @param {String} key
   * @return {*}
   */
  this.getPropertyValue = (property, key) => {
    let value = this.opts.val[key];
    // nullも値として有効なので`undefined`だけを対象とする。
    if (value === undefined) {
      value = getDefaultPropertyValue(property);
    }
    return value;
  };

  /**
   * 指定idxに対応するユーザ入力値を返却します。
   * @param {Number} idx
   * @return {*}
   */
  this.getItemValue = idx => {
    let value = this.opts.val[idx];
    // nullも値として有効なので`undefined`だけを対象とする。
    if (value === undefined) {
      if (this.type === 'array') {
        value = [];
      } else {
        // 明示的に`undefined`を設定。
        value = undefined;
      }
    }
    return value;
  };

  /**
   * PropertyObjectをSchemaObjectに変換して返却します。
   * @param {Object} propertyObject
   * @param {String} key
   * @return {Object}
   */
  this.getNormalizedSchemaObjectForProperty = (propertyObject, key) => {
    const normalizedSchemaObject = oas.createSchemaObjectFromPropertyObject(propertyObject, key);
    return normalizedSchemaObject;
  };

  /**
   * ItemsObjectをSchemaObjectに変換して返却します。
   * @param {Number} idx
   * @return {Object}
   */
  this.getNormalizedSchemaObjectForItem = idx => {
    const normalizedSchemaObject = oas.createSchemaObjectFromItemsObject(this.schemaObject.items, this.schemaObject.name, idx);
    return normalizedSchemaObject;
  };

  this.on('updated', () => {
    this.rebindTouchEvents();
  });

  // infoの開閉状態。
  this.isInfoOpened = true;
  // validateの開閉状態。
  this.isValidateOpened = true;
  // bodyの開閉状態。
  this.isBodyOpened = true;

  // infoの開閉ボタンがタップされた時の処理。
  this.handleInfoOpenShutButtonTap = () => {
    this.isInfoOpened = !this.isInfoOpened;
    this.update();
  };

  // validateの開閉ボタンがタップされた時の処理。
  this.handleValidateOpenShutButtonTap = () => {
    this.isValidateOpened = !this.isValidateOpened;
    this.update();
  };

  // bodyの開閉ボタンがタップされた時の処理。
  this.handleBodyOpenShutButtonTap = () => {
    this.isBodyOpened = !this.isBodyOpened;
    this.update();
  };

  // nameがタップされた時の処理。
  this.handleNameTap = () => {
    this.isBodyOpened = !this.isBodyOpened;
    this.update();
  };

  // +ボタンがタップされた時の処理。
  this.handleAddButtonTap = () => {
    const arr = this.opts.val.concat([]);
    // undefinedを追加することで空の入力フォームを出力できる。
    arr.push(undefined);
    this.opts.onchange(arr, this.opts.key);
  };

  // -ボタンがタップされた時の処理。
  this.handleRemoveButtonTap = () => {
    this.opts.onremove(this.opts.idx);
  };

  // itemsから削除依頼を受け取った時の処理。
  this.handleItemsRemove = idx => {
    const arr = this.opts.val.concat([]);
    // undefinedを追加することで空の入力フォームを出力できる。
    arr.splice(idx, 1);
    this.opts.onchange(arr, this.opts.key);
  };

  // formが変更された時の処理。
  this.handleFormChange = newValue => {
    this.opts.onchange(newValue, this.opts.key);
  };

  // propertiesが変更された時の処理。
  this.handlePropertyChange = (newValue, key) => {
    const obj = ObjectAssign(this.opts.val);
    obj[key] = newValue;
    this.opts.onchange(obj, this.opts.key);
  };

  // itemsが変更された時の処理。
  this.handleItemsChange = (newValue, idx) => {
    const arr = this.opts.val.concat([]);
    arr[idx] = newValue;
    this.opts.onchange(arr, this.opts.key);
  };
}
