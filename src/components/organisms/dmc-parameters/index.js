import ObjectAssign from 'object-assign';

export default function() {
  // TODO: default値を設定すること(parameterObject.default値)
  const initialParameters = ObjectAssign({}, this.opts.initialparameters);

  // parameter入力値群。
  this.currentParameters = ObjectAssign({}, this.opts.initialparameters);

  /**
   * parameter入力値を変更します。
   * @param {Object} parameterObject
   * @param {*} newValue
   */
  this.updateCurrentParameters = (parameterObject, newValue) => {
    // TODO: 入れ子対応。
    this.currentParameters[parameterObject.name] = newValue;
  };

  /**
   * 指定parameterObjectに対応するcurrentParameter値を返却します。
   * @param {Object} parameterObject
   */
  this.getCurrentParameter = (parameterObject, newValue) => {
    // TODO: 入れ子対応。
    return this.currentParameters[parameterObject.name];
  };

  /**
   * parameter入力値が変更された時の処理。
   * @param {Object} parameterObject
   * @param {*} newValue
   */
  this.handleChange = (parameterObject, newValue) => {
    this.updateCurrentParameters(parameterObject, newValue);
    this.opts.onchange(this.currentParameters);
  };
}
