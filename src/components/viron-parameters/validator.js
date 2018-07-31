// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2
// OAS2.0はJSON Schema SpecのDraft4を使用している。誤って最新Draftを参照しないように注意すること。
import dayjs from 'dayjs';
import forEach from 'mout/array/forEach';
import map from 'mout/array/map';
import reject from 'mout/array/reject';
import unique from 'mout/array/unique';
import deepClone from 'mout/lang/deepClone';
import isArray from 'mout/lang/isArray';
import isBoolean from 'mout/lang/isBoolean';
import isInteger from 'mout/lang/isInteger';
import isNull from 'mout/lang/isNull';
import isNumber from 'mout/lang/isNumber';
import isObject from 'mout/lang/isObject';
import isString from 'mout/lang/isString';
import isUndefined from 'mout/lang/isUndefined';
import hasOwn from 'mout/object/hasOwn';
import size from 'mout/object/size';
import ObjectAssign from 'object-assign';
import rfc3986 from 'rfc-3986';

const resultTemplate = {
  isValid: true,
  message: ''
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.1
const multipleOf = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'multipleOf')) {
    return result;
  }
  const multipleOf = constraints.multipleOf;
  if (!isNumber(multipleOf) || multipleOf < 0) {
    return result;
  }
  if ((value % multipleOf) !== 0) {
    result.isValid = false;
    result.message = `${multipleOf}で割り切れる数値にして下さい。`;
  }
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2
const maximumAndExclusiveMaximum = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'maximum')) {
    return result;
  }
  const maximum = constraints.maximum;
  if (!isNumber(maximum)) {
    return result;
  }
  // 未定義時はfalse扱い。
  const exclusiveMaximum = !!constraints.exclusiveMaximum;
  if (exclusiveMaximum) {
    if (value >= maximum) {
      result.isValid = false;
      result.message = `${maximum}より小さい数値にして下さい。`;
      return result;
    }
  } else {
    if (value > maximum) {
      result.isValid = false;
      result.message = `${maximum}以下の数値にして下さい。`;
      return result;
    }
  }
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3
const minimumAndExclusiveMinimum = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'minimum')) {
    return result;
  }
  const minimum = constraints.minimum;
  if (!isNumber(minimum)) {
    return result;
  }
  // 未定義時はfalse扱い。
  const exclusiveMinimum = !!constraints.exclusiveMinimum;
  if (exclusiveMinimum) {
    if (value <= minimum) {
      result.isValid = false;
      result.message = `${minimum}より大きい数値にして下さい。`;
      return result;
    }
  } else {
    if (value < minimum) {
      result.isValid = false;
      result.message = `${minimum}以上の数値にして下さい。`;
      return result;
    }
  }
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.1
const maxLength = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'maxLength')) {
    return result;
  }
  const maxLength = constraints.maxLength;
  if (!isInteger(maxLength) || maxLength < 0) {
    return result;
  }
  if (value.length > maxLength) {
    result.isValid = false;
    result.message = `文字数を${maxLength}以下にして下さい。`;
    return result;
  }
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2
const minLength = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  // デフォルト値は`0`。
  const minLength = constraints.minLength || 0;
  if (value.length < minLength) {
    result.isValid = false;
    result.message = `文字数を${minLength}以上にして下さい。`;
    return result;
  }
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3
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
    result.message = `${pattern}にマッチさせて下さい。`;
    return result;
  }
  return result;
};


// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.1
const additionalItemsAndItems = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  // SchemaObjectもしくは[SchemaObbject]。未定義時は空SchemaObject。
  let items;
  // booleanもしくはSchemaObject。
  let additionalItems;
  if (hasOwn(constraints, 'items')) {
    items = constraints.items;
  } else {
    items = {};
  }
  if (hasOwn(constraints, 'additionalItems')) {
    additionalItems = constraints.additionalItems;
  } else {
    additionalItems = {};
  }
  // itemsが未定義もしくはオブジェクトならばvalidate結果は常にOK。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.1.2
  if (isUndefined(items) || isObject(items)) {
    return result;
  }
  // additionalItemsがBooleanのtrueもしくはobjectならばvalidate結果は常にOK。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.1.2
  if ((isBoolean(additionalItems) && additionalItems) || isObject(additionalItems)) {
    return result;
  }
  // additionalItemsがBooleanのfalseでありitemsがarrayの場合、
  // value配列の長さがitemsの長さ以下ならばvalidate結果はOK。
  // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.1.3
  if ((isBoolean(additionalItems) && !additionalItems) && isArray(items)) {
    if (value.length <= items.length) {
      return result;
    }
  }
  result.isValid = false;
  result.message = `要素数を${items.length}以下にして下さい。`;
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.2
const maxItems = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'maxItems')) {
    return result;
  }
  const maxItems = constraints.maxItems;
  if (!isInteger(maxItems) || maxItems < 0) {
    return result;
  }
  if (value.length > maxItems) {
    result.isValid = false;
    result.message = `要素数を${maxItems}以下にして下さい。`;
    return result;
  }
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3
const minItems = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  // デフォルト値は`0`。
  const minItems = constraints.minItems || 0;
  if (value.length < minItems) {
    result.isValid = false;
    result.message = `要素数を${minItems}以上にして下さい。`;
    return result;
  }
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4
const uniqueItems = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  // デフォルト値はfalse。
  const uniqueItems = constraints.uniqueItems || false;
  if (!uniqueItems) {
    return result;
  }
  if (value.length !== unique(value, (a, b) => {
    a = JSON.stringify(deepClone(a));
    b = JSON.stringify(deepClone(b));
    return (a === b);
  }).length) {
    result.isValid = false;
    result.message = '内容が重複しない要素で構成して下さい。';
    return result;
  }
  return result;
};

// @see https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.4.1
const maxProperties = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'maxProperties')) {
    return result;
  }
  const maxProperties = constraints.maxProperties;
  if (!isInteger(maxProperties) || maxProperties < 0) {
    return result;
  }
  if (size(value) > maxProperties) {
    result.isValid = false;
    result.message = `要素数を${maxProperties}以下にして下さい。`;
    return result;
  }
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.4.2
const minProperties = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  // デフォルト値は`0`。
  const minProperties = constraints.minProperties || 0;
  if (size(value) < minProperties) {
    result.isValid = false;
    result.message = `要素数を${minProperties}以上にして下さい。`;
    return result;
  }
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.4.3
const required = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'required')) {
    return result;
  }
  const required = constraints.required;
  if (!isArray(required) || !required.length) {
    return result;
  }
  forEach(required, key => {
    if (!hasOwn(value, key)) {
      result.isValid = false;
      const description = constraints.properties[key].description ? `(${constraints.properties[key].description})` : '';
      result.message = `要素に${key}${description}を含めて下さい。`;
    }
  });
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.4.4
const additionalPropertiesAndPropertiesAndPatternProperties = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  // Object。valueはSchemaObject。デフォルト空Object。
  let properties;// eslint-disable-line no-unused-vars
  // Object。valueはSchemaObject。デフォルト空Object。
  let patternProperties;// eslint-disable-line no-unused-vars
  // boolean もしくは SchemaObject。デフォルト空SchemaObject。
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

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.4.5
const dependencies = (value, constraints) => {// eslint-disable-line no-unused-vars
  const result = ObjectAssign({}, resultTemplate);
  // TODO:
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.1
const _enum = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'enum')) {
    return result;
  }
  const _enum = constraints.enum;
  if (!isArray(_enum)) {
    return result;
  }
  let isFound = false;
  forEach(_enum, item => {
    if (value === item) {
      isFound = true;
    }
  });
  if (!isFound) {
    result.isValid = false;
    result.message = `${JSON.stringify(_enum)}のいずれかの値を設定して下さい。`;
  }
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.2
const _type = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'type')) {
    return result;
  }
  // typeはarrayもしくはstring
  let types;
  if (isArray(constraints.type)) {
    types = constraints.type;
  } else {
    types = [constraints.type];
  }
  let isValid = false;
  forEach(types, type => {
    switch (type) {
    case 'integer':
    case 'number':
      if (isNumber(value)) {
        isValid = true;
      }
      break;
    case 'string':
      if (isString(value)) {
        isValid = true;
      }
      break;
    case 'array':
      if (isArray(value)) {
        isValid = true;
      }
      break;
    case 'object':
      if (isObject(value)) {
        isValid = true;
      }
      break;
    case 'boolean':
      if (isBoolean(value)) {
        isValid = true;
      }
      break;
    case 'null':
      if (isNull(value)) {
        isValid = true;
      }
      break;
    case 'file':
      // primitive typeには含まれないが`file`もサポートする。
      if (!!value && isString(value.name)) {
        isValid = true;
      }
      break;
    default:
      break;
    }
  });
  if (!isValid) {
    result.isValid = false;
    result.message = `型を${JSON.stringify(types)}のいずれかにして下さい。`;
  }
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.3
const allOf = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'allOf')) {
    return result;
  }
  const allOf = constraints.allOf;
  if (!isArray(allOf)) {
    return result;
  }
  // TODO:
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.4
const anyOf = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'anyOf')) {
    return result;
  }
  const anyOf = constraints.anyOf;
  if (!isArray(anyOf)) {
    return result;
  }
  // TODO:
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.5
const oneOf = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'oneOf')) {
    return result;
  }
  const oneOf = constraints.oneOf;
  if (!isArray(oneOf)) {
    return result;
  }
  // TODO:
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.6
const not = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'not')) {
    return result;
  }
  const not = constraints.not;
  if (!isArray(not)) {
    return result;
  }
  // TODO:
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.7
const definitions = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'definitions')) {
    return result;
  }
  const definitions = constraints.definitions;
  if (!isArray(definitions)) {
    return result;
  }
  // TODO:
  return result;
};

// @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-7.2
const format = (value, constraints) => {
  const result = ObjectAssign({}, resultTemplate);
  if (!hasOwn(constraints, 'format')) {
    return result;
  }
  const format = constraints.format;
  if (!isString(format)) {
    return result;
  }
  switch (format) {
  case 'date-time': {
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-7.3.1
    // String型のときだけバリデートする
    if (!isString(value)) {
      return result;
    }
    // RFC 3339に則った書き方かバリデートする
    const pattern = /^(\d{4})-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d|60)(\.\d+)?(([Zz])|([\+\-])([01]\d|2[0-3]):([0-5]\d))$/;
    const isMatch = value.match(pattern);
    if (isNull(isMatch)) {
      result.isValid = false;
      result.message = '"date-time"に則ったフォーマットで入力してください。';
      return result;
    }
    // 存在する日付かチェックする(e.g. うるう年)
    const isValid = dayjs(value).isValid();
    if (!isValid) {
      result.isValid = false;
      result.message = '存在する日付を入力してください。';
      return result;
    }
    break;
  }
  case 'email': {
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-7.3.2
    // String型のときだけバリデートする
    if (!isString(value)) {
      return result;
    }
    // RFC 5322に則った書き方かバリデートする
    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isMatch = value.match(pattern);
    if (isNull(isMatch)) {
      result.isValid = false;
      result.message = '"email"に則ったフォーマットで入力してください。';
      return result;
    }
    break;
  }
  case 'hostname': {
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-7.3.3
    // String型のときだけバリデートする
    if (!isString(value)) {
      return result;
    }
    // hostnameが255文字を超えていたらエラー
    if (value.length > 255) {
      result.isValid = false;
      result.message = '"hostname"は255文字以内で入力してください。';
      return result;
    }
    // RFC 1034に則った書き方かバリデートする
    const pattern = /^[a-z\d]([a-z\d\-]{0,61}[a-z\d])?(\.[a-z\d]([a-z\d\-]{0,61}[‌​a-z\d])?)*$/i; // eslint-disable-line no-irregular-whitespace
    const isMatch = value.match(pattern);
    if (isNull(isMatch)) {
      result.isValid = false;
      result.message = '"hostname"に則ったフォーマットで入力してください。';
      return result;
    }
    break;
  }
  case 'ipv4': {
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-7.3.4
    // String型のときだけバリデートする
    if (!isString(value)) {
      return result;
    }
    // RFC 2673に則った書き方かバリデートする
    const pattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const isMatch = value.match(pattern);
    if (isNull(isMatch)) {
      result.isValid = false;
      result.message = '"ipv4"に則ったフォーマットで入力してください。';
      return result;
    }
    break;
  }
  case 'ipv6': {
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-7.3.5
    // String型のときだけバリデートする
    if (!isString(value)) {
      return result;
    }
    if (value.match(/::/)) {
      let targetColon = 7;
      // IPv4互換バージョンを使用している場合、ターゲット番号は：6
      if (value.match(/((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
        targetColon = 6;
      }
      // ipv6の形を成形する
      if (value.match(/^::/)) {
        value = value.replace('::', '0::');
      }
      if (value.match(/::$/)) {
        value = value.replace('::', '::0');
      }
      while (value.match(/:/g).length < targetColon) {
        value = value.replace('::', ':0::');
      }
      value = value.replace('::', ':0:');
    }

    // RFC 2373に則った書き方かバリデートする
    let patterns = [
      /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
      /^([0-9a-fA-F]{1,4}:){6}((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    ];
    let matchResult = false;
    forEach(patterns, pattern => {
      const isMatch = value.match(pattern);
      if (!isNull(isMatch)) {
        matchResult = true;
      }
    });
    if (!matchResult) {
      result.isValid = false;
      result.message = '"ipv6"に則ったフォーマットで入力してください。';
      return result;
    }
    break;
  }
  case 'uri': {
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-7.3.6
    // String型のときだけバリデートする
    if (!isString(value)) {
      return result;
    }
    // RFC 3986に則った書き方かバリデートする
    const pattern = rfc3986.uri;
    const isMatch = value.match(pattern);
    if (isNull(isMatch)) {
      result.isValid = false;
      result.message = '"uri"に則ったフォーマットで入力してください。';
      return result;
    }
    break;
  }
  /*
    case 'todo: custom format here':
    // TODO: 独自フォーマットがあればここに。
    break;
  */
  default:
    break;
  }
  return result;
};

export default {
  /**
   * @param {*} value
   * @param {Object} schemaObject
   * @return {Array}
   */
  errors: (value, schemaObject) => {
    const results = [];

    // undefinedは未入力扱いなのでvalidate対象にしない。
    // ただし、required(self)がtrueの場合はエラー。
    if (isUndefined(value)) {
      if (schemaObject.required) {
        return ['必須項目です。'];
      }
      return results;
    }

    // 先にtypeチェックを済ませておく。
    // type
    const result = _type(value, schemaObject);
    if (!result.isValid) {
      return [result.message];
    }

    // typeは7つのprimitive typesのいずれか。
    // 配列もあり得るがvironでは考慮しない。
    // type別のvalidate。
    const type = schemaObject.type;
    switch (type) {
    case 'number':
      // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1
      results.push(multipleOf(value, schemaObject));
      results.push(maximumAndExclusiveMaximum(value, schemaObject));
      results.push(minimumAndExclusiveMinimum(value, schemaObject));
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
      results.push(additionalPropertiesAndPropertiesAndPatternProperties(value, schemaObject));
      results.push(dependencies(value, schemaObject));
      break;
    default:
      break;
    }

    // 全てのtypeが対象。
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5
    results.push(_enum(value, schemaObject));
    // typeは先行チェック済。
    results.push(allOf(value, schemaObject));
    results.push(anyOf(value, schemaObject));
    results.push(oneOf(value, schemaObject));
    results.push(not(value, schemaObject));
    results.push(definitions(value, schemaObject));

    // format関連。
    // @see: https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-7
    results.push(format(value, schemaObject));

    // isValid値がfalseの結果だけ返す。
    return map(reject(results, result => {
      return result.isValid;
    }), result => {
      return result.message;
    });
  }
};
