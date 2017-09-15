import forEach from 'mout/array/forEach';
import isArray from 'mout/lang/isArray';
import hasOwn from 'mout/object/hasOwn';
import ObjectAssign from 'object-assign';
import oas from '../../../core/oas';

export default function() {
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#fixed-fields-7
  const schemaObject = ObjectAssign({}, this.opts.schemaobject);
  this.schemaObject = schemaObject;
  this.name = schemaObject.name;
  this.description = schemaObject.description;
  this.selfRequired = schemaObject.selfRequired;
  const keysForInfo = ['enum', 'description', 'required', 'type', 'example', 'multipleOf', 'maximum', 'exclusiveMaximum', 'minimum', 'exclusiveMinimum', 'maxLength', 'minLength', 'pattern', 'format', 'x-wyswyg-options'];
  this.infos = [];
  forEach(keysForInfo, key => {
    if (!hasOwn(schemaObject, key)) {
      return;
    }
    this.infos.push({
      key,
      value: JSON.stringify(schemaObject[key])
    });
  });

  /**
   * 入力可否をチェックします。
   * @return {Boolean}
   */
  this.checkIsDisabled = () => {
    const additionalInfo = this.opts.additionalinfo;
    // primaryキーがpathに含まれており、且つ入力対象keyが同一の場合。
    // get, post, put, deleteいかなるメソッドでも入力不可能にする。
    if (schemaObject.in === 'path' && schemaObject.name === additionalInfo.primaryKey) {
      return true;
    }
    // 特に問題なければ入力可能。
    return false;
  };
  // 入力可能 or not。
  this.isDisabled = this.checkIsDisabled();

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
  switch (schemaObject.type) {
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
  this.isInfoOpened = false;
  // 入力プレビューの開閉状態。
  this.isPreviewOpened = false;
  // validateの開閉状態。
  this.isValidateOpened = true;
  // bodyの開閉状態。
  this.isBodyOpened = true;

  // infoの開閉ボタンがタップされた時の処理。
  this.handleInfoOpenShutButtonTap = () => {
    this.isInfoOpened = !this.isInfoOpened;
    this.update();
  };

  // previewの開閉ボタンがタップされた時の処理。
  this.handlePreviewOpenShutButtonTap = () => {
    this.isPreviewOpened = !this.isPreviewOpened;
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
    if (this.isDisabled) {
      return;
    }
    const arr = this.opts.val.concat([]);
    let defaultValue = undefined;
    switch (schemaObject.items.type) {
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
    arr.push(defaultValue);
    this.opts.onchange(arr, this.opts.propkey);
  };

  // -ボタンがタップされた時の処理。
  this.handleRemoveButtonTap = () => {
    if (this.isDisabled) {
      return;
    }
    this.opts.onremove(this.opts.idx);
  };

  // itemsから削除依頼を受け取った時の処理。
  this.handleItemsRemove = idx => {
    const arr = this.opts.val.concat([]);
    // undefinedを追加することで空の入力フォームを出力できる。
    arr.splice(idx, 1);
    this.opts.onchange(arr, this.opts.propkey);
  };

  // formが変更された時の処理。
  this.handleFormChange = newValue => {
    this.opts.onchange(newValue, this.opts.propkey);
  };

  // propertiesが変更された時の処理。
  this.handlePropertyChange = (newValue, key) => {
    const obj = ObjectAssign(this.opts.val);
    obj[key] = newValue;
    this.opts.onchange(obj, this.opts.propkey);
  };

  // itemsが変更された時の処理。
  this.handleItemsChange = (newValue, idx) => {
    const arr = this.opts.val.concat([]);
    arr[idx] = newValue;
    this.opts.onchange(arr, this.opts.propkey);
  };
}
