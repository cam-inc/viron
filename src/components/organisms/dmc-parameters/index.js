import ObjectAssign from 'object-assign';

export default function() {
  // TODO: parameterObject.default対応。
  /**
   * 指定parameterObjectに対応するcurrentParameter値を返却します。
   * @param {Object} parameterObject
   */
  this.getParameterValue = parameterObject => {
    // TODO: 入れ子対応。
    return this.opts.parameters[parameterObject.name];
  };

  /**
   * parameter入力値が変更された時の処理。
   * @param {Object} parameterObject
   * @param {*} newValue
   */
  this.handleChange = (parameterObject, newValue) => {
    // TODO: 入れ子対応
    const newParameter = {};
    newParameter[parameterObject.name] = newValue;
    const newParameters = ObjectAssign({}, this.opts.parameters, newParameter);
    // TODO: null対応等
    this.opts.onchange(newParameters);
  };
}
