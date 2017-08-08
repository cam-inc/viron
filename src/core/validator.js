// @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6
// TODO: i18n対応すること。
import forEach from 'mout/array/forEach';
import unique from 'mout/array/unique';
import hasOwn from 'mout/object/hasOwn';
import keys from 'mout/object/keys';
import ObjectAssign from 'object-assign';

const resultTemplate = {
  isValid: true,
  message: ''
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.1
 * @param {Number} value
 * @param {Number} constraint
 * @return {Object}
 */
const multipleOf = (value, constraint) => {
  const result = ObjectAssign({}, resultTemplate);
  if ((value % constraint) !== 0) {
    result.isValid = false;
    result.message = `${value}を${constraint}で割り切れる数値にして下さい。`;
  }
  return result;
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.2
 * @param {Number} value
 * @param {Number} constraint
 * @return {Object}
 */
const maxmum = (value, constraint) => {
  const result = ObjectAssign({}, resultTemplate);
  if (value > constraint) {
    result.isValid = false;
    result.message = `${value}を${constraint}以下の数値にして下さい。`;
  }
  return result;
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.3
 * @param {Number} value
 * @param {Number} constraint
 * @return {Object}
 */
const exclusiveMaximum = (value, constraint) => {
  const result = ObjectAssign({}, resultTemplate);
  if (value >= constraint) {
    result.isValid = false;
    result.message = `${value}を${constraint}未満の数値にして下さい。`;
  }
  return result;
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4
 * @param {Number} value
 * @param {Number} constraint
 * @return {Object}
 */
const minimum = (value, constraint) => {
  const result = ObjectAssign({}, resultTemplate);
  if (value < constraint) {
    result.isValid = false;
    result.message = `${value}を${constraint}以上の数値にして下さい。`;
  }
  return result;
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5
 * @param {Number} value
 * @param {Number} constraint
 * @return {Object}
 */
const exclusiveMinimum = (value, constraint) => {
  const result = ObjectAssign({}, resultTemplate);
  if (value <= constraint) {
    result.isValid = false;
    result.message = `${value}を${constraint}より大きい数値にして下さい。`;
  }
  return result;
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.6
 * @param {String} value
 * @param {Number} constraint
 * @return {Object}
 */
const maxLength = (value, constraint) => {
  const result = ObjectAssign({}, resultTemplate);
  if (value.length > constraint) {
    result.isValid = false;
    result.message = `${value}の長さを${constraint}以下にして下さい。`;
  }
  return result;
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.7
 * @param {String} value
 * @param {Number} constraint
 * @return {Object}
 */
const minLength = (value, constraint) => {
  const result = ObjectAssign({}, resultTemplate);
  if (value.length < constraint) {
    result.isValid = false;
    result.message = `${value}の長さを${constraint}以上にして下さい。`;
  }
  return result;
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.8
 * @param {String} value
 * @param {Number} constraint
 * @return {Object}
 */
const pattern = (value, constraint) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!value.match(constraint)) {
    result.isValid = false;
    result.message = `${value}を${constraint}にマッチさせて下さい。`;
  }
  return result;
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.9
 * @param {Array} value
 * @param {Object|Array} constraint JSON Schema object or an array of type of it.
 * @return {Object}
 */
const items = (value, constraint) => {
  // TODO:
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.10
 * @param {String} value
 * @param {Object} constraint JSON Schema object.
 * @return {Object}
 */
const additionalItems = (value, constraint) => {
  // TODO
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.11
 * @param {Array} value
 * @param {Number} constraint
 * @return {Object}
 */
const maxItems = (value, constraint) => {
  const result = ObjectAssign({}, resultTemplate);
  if (value.length > constraint) {
    result.isValid = false;
    result.message = `要素数を${constraint}以下にして下さい。`;
  }
  return result;
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.12
 * @param {Array} value
 * @param {Number} constraint
 * @return {Object}
 */
const minItems = (value, constraint) => {
  const result = ObjectAssign({}, resultTemplate);
  if (value.length < constraint) {
    result.isValid = false;
    result.message = `要素数を${constraint}以上にして下さい。`;
  }
  return result;
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.13
 * @param {Array} value
 * @param {Boolean} constraint
 * @return {Object}
 */
const uniqueItems = (value, constraint) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!constraint) {
    return result;
  }
  if (value.length !== unique(value).length) {
    result.isValid = false;
    result.message = `内容が重複しない要素で構成して下さい。`;
  }
  return result;
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.14
 * @param {Array} value
 * @param {Object} constraint JSON Schema object
 * @return {Object}
 */
const contains = (value, constraint) => {
  // TODO
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.15
 * @param {Object} value
 * @param {Number} constraint
 * @return {Object}
 */
const maxProperties = (value, constraint) => {
  const result = ObjectAssign({}, resultTemplate);
  if (keys(value).length > constraint) {
    result.isValid = false;
    result.message = `要素数を${constraint}以下にして下さい。`;
  }
  return result;
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.16
 * @param {Object} value
 * @param {Number} constraint
 * @return {Object}
 */
const minProperties = (value, constraint) => {
  const result = ObjectAssign({}, resultTemplate);
  if (keys(value).length < constraint) {
    result.isValid = false;
    result.message = `要素数を${constraint}以上にして下さい。`;
  }
  return result;
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.17
 * @param {Object} value
 * @param {Array} constraint element should be type of string.
 * @return {Object}
 */
const required = (value, constraint) => {
  const result = ObjectAssign({}, resultTemplate);
  forEach(constraint, key => {
    if (!hasOwn(value, key)) {
      result.isValid = false;
      result.message = `要素に${key}を含めて下さい。`;
    }
  });
  return result;
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.18
 * @param {Object} value
 * @param {Object} constraint each value of this object is a valid JSON Schema.
 * @return {Object}
 */
const properties = (value, constraint) => {
  // TODO
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.19
 * @param {Object} value
 * @param {Object} constraint e.g) { regex : JSON Schema, regex : JSON Schema }
 * @return {Object}
 */
const patternProperties = (value, constraint) => {
  // TODO
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.20
 * @param {Object} value
 * @param {Object} constraint JSON Schema object
 * @return {Object}
 */
const additionalProperties = (value, constraint) => {
  // TODO
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.21
 * @param {Object} value
 * @param {Object} constraint
 * @return {Object}
 */
const dependencies = (value, constraint) => {
  // TODO
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.22
 * @param {Object} value
 * @param {Object} constraint JSON Schema object
 * @return {Object}
 */
const propertyNames = (value, constraint) => {
  // TODO
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.23
 * @param {Object} value
 * @param {Array} constraint
 * @return {Object}
 */
const _enum = (value, constraint) => {
  const result = ObjectAssign({}, resultTemplate);
  let isFound = false;
  forEach(constraint, item => {
    if (value === item) {
      isFound = true;
    }
  });
  if (!isFound) {
    result.isValid = false;
    result.message = `${constraint}のいずれかの値を設定して下さい。`;
  }
  return result;
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.24
 * @param {*} value
 * @param {*} constraint
 * @return {Object}
 */
const _const = (value, constraint) => {
  const result = ObjectAssign({}, resultTemplate);
  if (value !== constraint) {
    result.isValid = false;
    result.message = `${constraint}と同じ値を設定して下さい。`;
  }
  return result;
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.25
 * @param {*} value
 * @param {String|Array} constraint if type of array the elements should be type of string. string value should be one of "null", "boolean", "object", "array", "number", "string" or "integer".
 * @return {Object}
 */
const type = (value, constraint) => {
  // TODO:
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.26
 * @param {*} value
 * @param {Array} constraint non-empty. element should be JSON Schema object
 * @return {Object}
 */
const allOf = (value, constraint) => {
  // TODO:
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.27
 * @param {*} value
 * @param {Array} constraint non-empty. element should be JSON Schema object
 * @return {Object}
 */
const anyOf = (value, constraint) => {
  // TODO:
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.28
 * @param {*} value
 * @param {Array} constraint non-empty. element should be JSON Schema object
 * @return {Object}
 */
const oneOf = (value, constraint) => {
  // TODO:
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.29
 * @param {*} value
 * @param {Object} constraint JSON Schema object
 * @return {Object}
 */
const not = (value, constraint) => {
  // TODO:
};

/**
 * @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.3
 * @param {*} value
 * @param {String} constraint
 * @return {Object}
 */
const format = (value, constraint) => {
  const result = ObjectAssign({}, resultTemplate);
  switch (constraint) {
    // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.3.1
  case 'date-time':
    // TODO
    break;
    // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.3.2
  case 'email':
    // TODO
    break;
    // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.3.3
  case 'hostname':
    // TODO
    break;
    // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.3.4
  case 'ipv4':
    // TODO
    break;
    // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.3.5
  case 'ipv6':
    // TODO
    break;
    // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.3.6
  case 'uri':
    // TODO
    break;
    // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.3.7
  case 'uri-reference':
    // TODO
    break;
    // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.3.8
  case 'uri-template':
    // TODO
    break;
    // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.3.9
  case 'json-pointer':
    // TODO
    break;
  default:
    break;
  }
  return result;
};
