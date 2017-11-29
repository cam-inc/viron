import contains from 'mout/array/contains';
import forEach from 'mout/array/forEach';
import times from 'mout/function/times';
import deepClone from 'mout/lang/deepClone';
import isArray from 'mout/lang/isArray';
import isInteger from 'mout/lang/isInteger';
import isUndefined from 'mout/lang/isUndefined';
import forOwn from 'mout/object/forOwn';

const UI_TEXTINPUT = 'textinput';
const UI_TEXTAREA = 'textarea';
const UI_HTML = 'html';
const UI_NUMBERINPUT = 'numberinput';
const UI_CHECKBOX = 'checkbox';
const UI_SELECT = 'select';
const UI_DATEPICKER = 'datepicker';// eslint-disable-line no-unused-vars
const UI_UPLOADER = 'uploader';
const UI_WYSWYG = 'wyswyg';
const UI_PUG = 'pug';
const UI_NULL = 'null';
const UI_AUTOCOMPLETE = 'autocomplete';

export default {
  /**
   * FormObjectから最適なUIタイプを推測します。
   * @param {Object} formObject
   * @return {String}
   */
  getUIType: formObject => {
    // typeが`array`や`object`の時にform.tagが使用されることは無い。
    // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.25
    // 選択肢があるとき。
    if (!!formObject.enum) {
      return UI_SELECT;
    }
    // autocomplete有効時。
    if (!!formObject['x-autocomplete']) {
      return UI_AUTOCOMPLETE;
    }
    const type = formObject.type;
    const format = formObject.format;
    switch (type) {
    case 'string':
      switch (format) {
      case 'date-time':
        //return UI_DATEPICKER;
        return UI_TEXTINPUT;
      case 'multiline':
        return UI_TEXTAREA;
      case 'wyswyg':
        return UI_WYSWYG;
      case 'pug':
        return UI_PUG;
      case 'html':
        return UI_HTML;
      default:
        return UI_TEXTINPUT;
      }
    case 'number':
    case 'integer':
      return UI_NUMBERINPUT;
    case 'boolean':
      return UI_CHECKBOX;
    case 'file':
      return UI_UPLOADER;
    case 'null':
      return UI_NULL;
    default:
      // OpenAPI Documentが正しければ処理がここに来ることはない。
      break;
    }
  },

  /**
   * FormUIを横幅いっぱいに表示するか否かを調べます。
   * @param {Object} formObject
   * @return {Boolean}
   */
  isWide: formObject => {
    switch (formObject.type) {
    case 'string':
      switch (formObject.format) {

      case 'multiline':
      case 'wyswyg':
      case 'pug':
      case 'html':
        return true;
      case 'date-time':
      default:
        return false;
      }
    case 'number':
    case 'integer':
    case 'boolean':
    case 'file':
    case 'null':
    default:
      return false;
    }
  },

  /**
   * OASのdefaultを元にフォーム入力初期値を算出します。
   * @param {Array} parameterObjects
   * @param {Object} initialVal
   * @return {Object}
   */
  generateInitialVal: (parameterObjects = [], initialVal = {}) => {
    // ParameterObjectに対する処理。
    const checkParameterObject = (parameterObject, val) => {
      const name = parameterObject.name;
      const _default = parameterObject.default;
      const required = parameterObject.required;
      const _in = parameterObject.in;
      // 値が設定されていればスルー。
      if (!isUndefined(val.name)) {
        return;
      }
      // defaultが設定されていればそれを使用する。
      if (!isUndefined(_default)) {
        val[name] = deepClone(_default);
        return;
      }
      // requiredがfalseならスルー。
      if (!required) {
        return;
      }
      // この時点で、入力必須だけどユーザ未入力な状態。可能な限り初期値を設定する。
      // inは"query", "header", "path", "formData", "body"のいずれか。
      if (contains(['formData', 'header', 'path', 'query'], _in)) {
        // 初期値設定不可能。
        return;
      }
      // この時点でinは必ず'body'になる。
      const schema = parameterObject.schema;
      if (contains(['boolean', 'integer', 'number', 'null', 'string'], schema.type)) {
        // 初期値設定不可能。
        return;
      }
      if (schema.type === 'object') {
        val[name] = {};
        generateDefaultProperties(schema, val[name]);
      }
      if (schema.type === 'array') {
        val = [];
        // 最低要素数が決まっていれば予めその要素数分を生成する。
        const minItems = schema.minItems;
        if (isInteger(minItems) && minItems > 0) {
          times(minItems, () => {
            val.push(generateDefaultItem(schema.items));
          });
        }
      }
    };

    // SchemaObjectのpropertiesを元に初期値を生成して返却します。
    // @param {Object} schemaObject
    // @param {Object} val
    // @param {Object}
    const generateDefaultProperties = (schemaObject, val = {}) => {
      const properties = schemaObject.properties;
      const required = schemaObject.required || [];
      forOwn(properties, (property, key) => {
        if (contains(['boolean', 'integer', 'number', 'null', 'string'], property.type)) {
          if (!isUndefined(val[key])) {
            return;
          }
          if (isUndefined(property.default)) {
            return;
          }
          val[key] = property.default;
        }
        if (property.type === 'object') {
          if (!contains(required, key)) {
            return;
          }
          val[key] = {};
          generateDefaultProperties(property, val[key]);
        }
        if (property.type === 'array') {
          if (!contains(required, key)) {
            return;
          }
          val[key] = [];
          const minItems = property.minItems;
          if (isInteger(minItems) && minItems > 0) {
            times(minItems, () => {
              val[key].push(generateDefaultItem(property.items));
            });
          }
        }
      });
      return val;
    };

    // ItemsObjectを元に初期値を生成して返却します。
    // @param {Object|Array<Object>} itemsObject
    // @return {*}
    const generateDefaultItem = itemsObject => {
      if (isArray(itemsObject)) {
        itemsObject = itemsObject[0];
      }
      if (contains(['boolean', 'integer', 'number', 'null', 'string'], itemsObject.type)) {
        return itemsObject.default;
      }
      if (itemsObject.type === 'object' && itemsObject) {
        return generateDefaultProperties(itemsObject);
      }
      if (itemsObject.type === 'array') {
        if (!itemsObject.required) {
          return undefined;
        }
        const ret = [];
        const minItems = itemsObject.minItems;
        if (isInteger(minItems) && minItems > 0) {
          times(minItems, () => {
            ret.push(generateDefaultItem(itemsObject.items));
          });
        }
        return ret;
      }
      return undefined;
    };

    const val = deepClone(initialVal);
    forEach(parameterObjects, parameterObject => {
      checkParameterObject(parameterObject, val);
    });
    return val;
  }

};
