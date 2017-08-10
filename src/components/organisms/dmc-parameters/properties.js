import ObjectAssign from 'object-assign';

export default function() {
  // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.18
  const properties = ObjectAssign({}, this.opts.properties);
  this.properties = properties;
  this.required = (this.opts.required || []).concat([]);

  /**
   * propertyを参照してデフォルト値を返します。
   * @param {Object} property
   * @return {*}
   */
  const getDefaultValue = property => {
    // 上書き予防。
    property = ObjectAssign({}, property);
    let defaultValue;
    let type;
    if (Array.isArray(property.type)) {
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
      value = getDefaultValue(property);
    }
    return value;
  };

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

  // propertyが変更された時の処理。
  this.handlePropertyChange = (newValue, key) => {
    const obj = ObjectAssign({}, this.opts.val);
    obj[key] = newValue;
    this.opts.onchange(obj);
  };
}
