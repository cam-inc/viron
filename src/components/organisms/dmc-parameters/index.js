import ObjectAssign from 'object-assign';

export default function() {
  /**
   * ParameterObjectを参照してデフォルト値を返します。
   * @param {Object} parameterObject
   * @return {*}
   */
  const getDefaultValue = parameterObject => {
    // 上書き予防。
    parameterObject = ObjectAssign({}, parameterObject);
    let defaultValue;
    const _in = parameterObject.in;
    if (_in === 'body') {
      // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.2
      let type;
      if (Array.isArray(parameterObject.schema.type)) {
        type = parameterObject.schema.type[0];
      } else {
        type = parameterObject.schema.type;
      }
      // @see: https://tools.ietf.org/html/draft-zyp-json-schema-04#section-3.5
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
    } else {
      // デフォルト値が指定されていなければ、type値から適切なデフォルト値を決定する。
      switch (parameterObject.type) {
      case 'array':
        defaultValue = [];
        break;
      case 'string':
      case 'number':
      case 'integer':
      case 'boolean':
      case 'file':
      default:
        // 意図的に`undefined`をデフォルト値とする。
        defaultValue = undefined;
        break;
      }
    }
    return defaultValue;
  };

  /**
   * 指定parameterObjectに対応するユーザ入力値を返却します。
   * @param {Object} parameterObject
   * @return {*}
   */
  this.getParameterValue = parameterObject => {
    let value = this.opts.parameters[parameterObject.name];
    // nullも値として有効なので`undefined`だけを対象とする。
    if (value === undefined) {
      value = getDefaultValue(parameterObject);
    }
    return value;
  };

  /**
   * parameter入力値が変更された時の処理。
   * @param {Object} parameterObject
   * @param {*} newValue
   */
  this.handleChange = (parameterObject, newValue) => {
    const newParameter = {};
    newParameter[parameterObject.name] = newValue;
    const newParameters = ObjectAssign({}, this.opts.parameters, newParameter);
    this.opts.onchange(newParameters);
  };
}
