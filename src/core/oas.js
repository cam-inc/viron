import forEach from 'mout/array/forEach';
import reject from 'mout/array/reject';
import unique from 'mout/array/unique';
import isArray from 'mout/lang/isArray';
import isBoolean from 'mout/lang/isBoolean';
import isNull from 'mout/lang/isNull';
import isNumber from 'mout/lang/isNumber';
import isObject from 'mout/lang/isObject';
import isString from 'mout/lang/isString';
import hasOwn from 'mout/object/hasOwn';
import keys from 'mout/object/keys';
import ObjectAssign from 'object-assign';

const resultTemplate = {
  isValid: true,
  message: ''
};

/**
 * 独自validate。
 * ParameterObjectのrequired(boolean)に対応するため。
 * @param {Object} value
 * @param {Object} constraints
 * @return {Object}
 */
const selfRequired = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'selfRequired')) {
    return result;
  }
  if (isBoolean(constraints.selfRequired) && constraints.selfRequired) {
    if (value === undefined) {
      result.isValid = false;
      result.message = '必須項目です。';
      return result;
    }
  }

  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1
 * @param {Number} value
 * @param {Object} constraints
 * @return {Object}
 */
const multipleOf = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'multipleOf')) {
    return result;
  }
  const multipleOf = constraints.multipleOf;
  if ((value % multipleOf) !== 0) {
    result.isValid = false;
    result.message = `${value}を${multipleOf}で割り切れる数値にして下さい。`;
    return result;
  }
  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2
 * @param {Number} value
 * @param {Object} constraints
 * @return {Object}
 */
const maximum = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'maximum')) {
    return result;
  }
  const maximum = constraints.maximum;
  // 未定義時はfalse扱い。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2.3
  const exclusiveMaximum = !!constraints.exclusiveMaximum;
  if (exclusiveMaximum) {
    if (value >= maximum) {
      result.isValid = false;
      result.message = `${value}を${maximum}より小さい数値にして下さい。`;
      return result;
    }
  } else {
    if (value > maximum) {
      result.isValid = false;
      result.message = `${value}を${maximum}以下の数値にして下さい。`;
      return result;
    }
  }
  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3
 * @param {Number} value
 * @param {Object} constraints
 * @return {Object}
 */
const minimum = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'minimum')) {
    return result;
  }
  const minimum = constraints.minimum;
  // 未定義時はfalse扱い。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3.3
  const exclusiveMinimum = !!constraints.exclusiveMinimum;
  if (exclusiveMinimum) {
    if (value <= minimum) {
      result.isValid = false;
      result.message = `${value}を${minimum}より大きい数値にして下さい。`;
      return result;
    }
  } else {
    if (value < minimum) {
      result.isValid = false;
      result.message = `${value}を${minimum}以上の数値にして下さい。`;
      return result;
    }
  }
  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.1
 * @param {String} value
 * @param {Object} constraints
 * @return {Object}
 */
const maxLength = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'maxLength')) {
    return result;
  }
  const maxLength = constraints.maxLength;
  if (value.length > maxLength) {
    result.isValid = false;
    result.message = `${value}の文字数を${maxLength}以下にして下さい。`;
    return result;
  }
  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2
 * @param {String} value
 * @param {Object} constraints
 * @return {Object}
 */
const minLength = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  // デフォルト値は`0`。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2.3
  const minLength = constraints.minLength || 0;
  if (value.length < minLength) {
    result.isValid = false;
    result.message = `${value}の文字数を${minLength}以上にして下さい。`;
    return result;
  }
  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3
 * @param {String} value
 * @param {Object} constraints
 * @return {Object}
 */
const pattern = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'pattern')) {
    return result;
  }
  // ECMA 262 regular expression dialect.
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3.1
  const pattern = constraints.pattern;
  if (!value.match(pattern)) {
    result.isValid = false;
    result.message = `${value}を${pattern}にマッチさせて下さい。`;
    return result;
  }
  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.1
 * @param {Array} value
 * @param {Object} constraints
 * @return {Object}
 */
const additionalItemsAndItems = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  // itemsはSchemaObject or array of SchemaObject.
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.1.1
  // additionalItemsはboolean or SchemaObject.
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.1.1
  // 未定義の場合は空のSchemaObjectになる。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.1.4
  let items;
  let additionalItems;
  if (!hasOwn(constraints, 'items')) {
    items = {};
  } else {
    items = constraints.items;
  }
  if (!hasOwn(constraints, 'additionalItems')) {
    additionalItems = {};
  } else {
    additionalItems = constraints.additionalItems;
  }

  // itemsが未定義もしくはオブジェクトならばvalidate結果は常にOK。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.1.2
  if (isObject(items)) {
    return result;
  }
  // additionalItemsがBooleanのtrueもしくはobjectならばvalidate結果は常にOK。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.1.1
  if ((isBoolean(additionalItems) && additionalItems) || isObject(additionalItems)) {
    return result;
  }
  // additionalItemsがBooleanのfalseでありitemsがarrayの場合、
  // value配列の長さがitemsの長さ以下ならばvalidate結果はOK。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.1.1
  if ((isBoolean(additionalItems) && !additionalItems) && isArray(items)) {
    if (value.length <= items.length) {
      return result;
    }
  }

  result.isValid = false;
  result.message = `${value}を[items: ${items}]、[additionalItems: ${additionalItems}]をパスするように書き換えて下さい。`;
  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.2
 * @param {Array} value
 * @param {Object} constraints
 * @return {Object}
 */
const maxItems = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'maxItems')) {
    return result;
  }
  const maxItems = constraints.maxItems;
  if (value.length > maxItems) {
    result.isValid = false;
    result.message = `${value}の要素数を${maxItems}以下にして下さい。`;
    return result;
  }

  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3
 * @param {Array} value
 * @param {Object} constraints
 * @return {Object}
 */
const minItems = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  // デフォルト値は`0`。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3.3
  const minItems = constraints.minItems || 0;
  if (value.length < minItems) {
    result.isValid = false;
    result.message = `${value}の要素数を${minItems}以上にして下さい。`;
    return result;
  }

  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4
 * @param {Array} value
 * @param {Object} constraints
 * @return {Object}
 */
const uniqueItems = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  // デフォルト値はfalse。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4.3
  const uniqueItems = constraints.uniqueItems || false;
  if (!uniqueItems) {
    return result;
  }
  if (value.length !== unique(value).length) {
    result.isValid = false;
    result.message = '内容が重複しない要素で構成して下さい。';
    return result;
  }

  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.4.1
 * @param {Object} value
 * @param {Object} constraints
 * @return {Object}
 */
const maxProperties = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'maxProperties')) {
    return result;
  }
  const maxProperties = constraints.maxProperties;
  if (keys(value).length > maxProperties) {
    result.isValid = false;
    result.message = `要素数を${maxProperties}以下にして下さい。`;
    return result;
  }

  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.4.2
 * @param {Object} value
 * @param {Object} constraints
 * @return {Object}
 */
const minProperties = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  // デフォルト値は`0`。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.4.2.3
  const minProperties = constraints.minProperties || 0;
  if (keys(value).length < minProperties) {
    result.isValid = false;
    result.message = `要素数を${minProperties}以上にして下さい。`;
    return result;
  }

  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.4.3
 * @param {Object} value
 * @param {Object} constraints
 * @return {Object}
 */
const required = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  // JsonSchema仕様ではrequiredは常にarrayだが、OASとの兼ね合いで特別にbooleanも許可する。
  if (isBoolean(constraints.required) && constraints.required) {
    if (value === undefined) {
      result.isValid = false;
      result.message = '必須項目です。';
      return result;
    } else {
      return result;
    }
  }
  if (!isArray(constraints.required) || !!constraints.required.length) {
    return result;
  }
  const required = constraints.required;
  forEach(required, key => {
    if (!hasOwn(value, key)) {
      result.isValid = false;
      result.message = `要素に${key}を含めて下さい。`;
    }
  });

  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.4.4
 * @param {Object} value
 * @param {Object} constraints
 * @return {Object}
 */
const additionalPropertiesAndPropertiesAndPatternPropertie = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  // `properties`と`patternProperties`のデフォルト値は空オブジェクト。
  // `additionalProperties`のデフォルト値は空SchemaObject。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.4.4.3
  let properties;// eslint-disable-line no-unused-vars
  let patternProperties;// eslint-disable-line no-unused-vars
  let additionalProperties;// eslint-disable-line no-unused-vars
  if (!hasOwn(constraints, 'properties')) {
    properties = {};
  } else {
    properties = constraints.properties;
  }
  if (!hasOwn(constraints, 'patternProperties')) {
    patternProperties = {};
  } else {
    patternProperties = constraints.patternProperties;
  }
  if (!hasOwn(constraints, 'additionalProperties')) {
    additionalProperties = {};
  } else {
    additionalProperties = constraints.additionalProperties;
  }

  // additionalPropertiesはBooleanもしくはSchemaObject。
  // propertiesはオブジェクト。中身の値(key-valueのvalue)はSchemaObject。
  // patternPropertiesはオブジェクト。keyはECMA 262 regular expression dialectに沿う文字列でvalueはSchemaObject。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.4.4.1

  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.4.4.2
  if ((isBoolean(additionalProperties) && additionalProperties) || isObject(additionalProperties)) {
    return result;
  }

  if (isBoolean(additionalProperties) && !additionalProperties) {
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.4.4.4
    // TODO:
  }

  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.4.5
 * @param {Object} value
 * @param {Object} constraints
 * @return {Object}
 */
const dependencies = (value, constraints) => {// eslint-disable-line no-unused-vars
  const result = ObjectAssign({}, resultTemplate);
  // TODO:
  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.1
 * @param {*} value
 * @param {Object} constraints
 * @return {Object}
 */
const _enum = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'enum')) {
    return result;
  }
  const _enum = constraints.enum;
  let isFound = false;
  forEach(_enum, item => {
    if (value === item) {
      isFound = true;
    }
  });
  if (!isFound) {
    result.isValid = false;
    result.message = `${_enum}のいずれかの値を設定して下さい。`;
  }
  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.2
 * @param {*} value
 * @param {Object} constraints
 * @return {Object}
 */
const _type = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'type')) {
    return result;
  }
  let types;
  // type値はstringもしくはstring型のarray。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.2.1
  if (isString(constraints.type)) {
    types = [constraints.type];
  } else {
    types = constraints.type;
  }
  let isValidType = false;
  forEach(types, type => {
    switch (type) {
    case 'integer':
    case 'number':
      if (isNumber(value)) {
        isValidType = true;
      }
      break;
    case 'string':
      if (isString(value)) {
        isValidType = true;
      }
      break;
    case 'array':
      if (isArray(value)) {
        isValidType = true;
      }
      break;
    case 'object':
      if (isObject(value)) {
        isValidType = true;
      }
      break;
    case 'boolean':
      if (isBoolean(value)) {
        isValidType = true;
      }
      break;
    case 'null':
      if (isNull(value)) {
        isValidType = true;
      }
      break;
    default:
      break;
    }
  });
  if (!isValidType) {
    result.isValid = false;
    result.message = `${value}の型を${types}のいずれかにして下さい。`;
  }
  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.3
 * @param {*} value
 * @param {Object} constraints
 * @return {Object}
 */
const allOf = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!isArray(constraints.allOf)) {
    return result;
  }
  // SchemaObjectのarray。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.3.1
  const allOf = constraints.allOf;// eslint-disable-line no-unused-vars
  // TODO:
  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.4
 * @param {*} value
 * @param {Object} constraints
 * @return {Object}
 */
const anyOf = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!isArray(constraints.anyOf)) {
    return result;
  }
  // SchemaObjectのarray。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.4.1
  const anyOf = constraints.anyOf;// eslint-disable-line no-unused-vars
  // TODO:
  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.5
 * @param {*} value
 * @param {Object} constraints
 * @return {Object}
 */
const oneOf = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!isArray(constraints.oneOf)) {
    return result;
  }
  // SchemaObjectのarray。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.5.1
  const oneOf = constraints.oneOf;// eslint-disable-line no-unused-vars
  // TODO:
  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.6
 * @param {*} value
 * @param {Object} constraints
 * @return {Object}
 */
const not = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!isArray(constraints.not)) {
    return result;
  }
  // SchemaObjectのarray。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.6.1
  const not = constraints.not;// eslint-disable-line no-unused-vars
  // TODO:
  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.7
 * @param {*} value
 * @param {Object} constraints
 * @return {Object}
 */
const definitions = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!isArray(constraints.definitions)) {
    return result;
  }
  // SchemaObjectのarray。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.7.1
  const definitions = constraints.definitions;// eslint-disable-line no-unused-vars
  // TODO:
  return result;
};

/**
 * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-7.2
 * @param {*} value
 * @param {Object} constraints
 * @return {Object}
 */
const format = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!isString(constraints.format)) {
    return result;
  }
  const format = constraints.format;
  switch (format) {
  case 'date-time':
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-7.3.1
    // TODO
    break;
  case 'email':
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-7.3.2
    // TODO
    break;
  case 'hostname':
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-7.3.3
    // TODO
    break;
  case 'ipv4':
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-7.3.4
    // TODO
    break;
  case 'ipv6':
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-7.3.5
    // TODO
    break;
  case 'uri':
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-7.3.6
    // TODO
    break;
    /*
  case 'todo: custom format here':
    // TODO: 独自フォーマットがあればここに。
    break;
    */
  default:
    break;
  }
  // TODO:
  return result;
};

export default {
  /**
   * OASに沿って値を検証します。
   * @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2
   * NOTE: OAS2.0はJSON Schema SpecのDraft4を使用している。誤って最新Draftを参照しないように注意すること。
   * TODO: i18n対応すること。
   * @param {*} value
   * @param {Object} schemaObject
   * @return {Array}
   */
  validate: (value, schemaObject) => {
    const results = [];

    // typeとselfRequiredチェックだけ最初に済ませておく。
    let result = _type(value, schemaObject);
    if (!result.isValid) {
      return [result];
    }
    result = selfRequired(value, schemaObject);
    if (!result.isValid) {
      return [result];
    }

    const type = schemaObject.type;
    switch (type) {
    case 'number':
    case 'integer':
      // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1
      results.push(multipleOf(value, schemaObject));
      results.push(maximum(value, schemaObject));
      results.push(minimum(value, schemaObject));
      break;
    case 'string':
      // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2
      results.push(maxLength(value, schemaObject));
      results.push(minLength(value, schemaObject));
      results.push(pattern(value, schemaObject));
      break;
    case 'array':
      // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3
      results.push(additionalItemsAndItems(value, schemaObject));
      results.push(maxItems(value, schemaObject));
      results.push(minItems(value, schemaObject));
      results.push(uniqueItems(value, schemaObject));
      break;
    case 'object':
      // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.4
      results.push(maxProperties(value, schemaObject));
      results.push(minProperties(value, schemaObject));
      results.push(required(value, schemaObject));
      results.push(additionalPropertiesAndPropertiesAndPatternPropertie(value, schemaObject));
      results.push(dependencies(value, schemaObject));
      break;
    default:
      break;
    }

    // どのtypeも対象となるvalidate。
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5
    results.push(_enum(value, schemaObject));
    results.push(allOf(value, schemaObject));
    results.push(anyOf(value, schemaObject));
    results.push(oneOf(value, schemaObject));
    results.push(not(value, schemaObject));
    results.push(definitions(value, schemaObject));

    // format関連。
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-7
    results.push(format(value, schemaObject));

    // isValid値がfalseの結果だけ返す。
    return reject(results, result => {
      return result.isValid;
    });
  },

  /**
   * ParameterObjectとSchemaObjectを元にSchemaObjectを生成します。
   * @param {Object} parameterObject
   * @param {Object} schemaObject
   * @return {Oject}
   */
  createSchemaObjectFromParameterObject: parameterObject => {
    const normalizedSchemaObject = ObjectAssign({}, parameterObject);
    const selfRequired = normalizedSchemaObject.required;
    delete normalizedSchemaObject.required;
    normalizedSchemaObject.selfRequired = selfRequired;
    return normalizedSchemaObject;
  },

  /**
   * ParameterObjectとSchemaObjectを元にSchemaObjectを生成します。
   * @param {Object} parameterObject
   * @param {Object} schemaObject
   * @return {Oject}
   */
  createSchemaObjectFromParameterObjectAndSchemaObject: (parameterObject, schemaObject) => {
    let normalizedSchemaObject = ObjectAssign({}, parameterObject);
    const selfRequired = normalizedSchemaObject.required;
    delete normalizedSchemaObject.required;
    normalizedSchemaObject.selfRequired = selfRequired;
    normalizedSchemaObject = ObjectAssign(normalizedSchemaObject, schemaObject);
    return normalizedSchemaObject;
  },

  /**
   * PropertyObjectと他情報を元にSchemaObjectを生成します。
   * @param {Object} propertyObject
   * @param {String} key
   * @return {Object}
   */
  createSchemaObjectFromPropertyObject: (propertyObject, key) => {
    const normalizedSchemaObject = ObjectAssign({}, propertyObject);
    // nameが未設定であれば、propertyObjectのkeyを使用する。
    if (!normalizedSchemaObject.name) {
      normalizedSchemaObject.name = key;
    }
    return normalizedSchemaObject;
  },

  /**
   * ItemsObjectと他情報を元にSchemaObjectを生成します。
   * @param {Object} itemsObject
   * @param {String} baseName
   * @param {String} idx
   * @return {Object}
   */
  createSchemaObjectFromItemsObject: (itemsObject, baseName, idx) => {
    const normalizedSchemaObject = ObjectAssign({}, itemsObject);
    // nameが未設定であれば、propertyObjectのkeyを使用する。
    if (!normalizedSchemaObject.name) {
      normalizedSchemaObject.name = `${baseName}[${idx}]`;
    }
    return normalizedSchemaObject;
  }
};
