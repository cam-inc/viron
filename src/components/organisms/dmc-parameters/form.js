import deepClone from 'mout/lang/deepClone';
import ObjectAssign from 'object-assign';

const UI_TEXTINPUT = 'textinput';
const UI_CHECKBOX = 'checkbox';
const UI_SELECT = 'select';
const UI_UPLOADER = 'uploader';

export default function() {
  const parameterObject = ObjectAssign({}, this.opts.parameterobject);
  this.parameterObject = parameterObject;
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#fixed-fields-7
  this.name = parameterObject.name;
  this._in = parameterObject.in;// 'query', 'header', 'path', 'formData' or 'body'.
  this.description = parameterObject.description;
  this.required = parameterObject.required;
  this.type = parameterObject.type;// 'string', 'number', 'integer', 'boolean', 'array' or 'file'.
  this.format = parameterObject.format;
  this.allowEmptyValue = parameterObject.allowEmptyValue;
  this.items = parameterObject.items;// Required if type is 'array'.
  this.collectionFormat = parameterObject.collectionFormat;
  this._default = parameterObject.default;
  this.maximum = parameterObject.maximum;
  this.exclusiveMaximum = parameterObject.exclusiveMaximum;
  this.minimum = parameterObject.minimum;
  this.exclusiveMinimum = parameterObject.exclusiveMinimum;
  this.maxLength = parameterObject.maxLength;
  this.minLength = parameterObject.minLength;
  this.pattern = parameterObject.pattern;
  this.maxItems = parameterObject.maxItems;
  this.minItems = parameterObject.minItems;
  this.uniqueItems = parameterObject.uniqueItems;
  this.enum = parameterObject.enum;
  this.multipleOf = parameterObject.multipleOf;

  /**
   * typeとformat値から最適なUIを決定します。
   * @return {String}
   */
  const getUIType = () => {
    // type値は'string', 'number', 'integer', 'boolean', 'array' or 'file'.
    // in: 'body'以外の時だけtype値あり。
    let uiType = '';
    switch (this.type) {
    case 'string':
      switch (this.format) {
      case 'date-time':
        // TODO: datepicker表示
        break;
      default:
        uiType = UI_TEXTINPUT;
        break;
      }
      break;
    case 'number':
    case 'integer':
      uiType = UI_TEXTINPUT;
      break;
    case 'boolean':
      uiType = UI_CHECKBOX;
      break;
    case 'array':
      // TODO: 要チェック
      uiType = UI_SELECT;
      break;
    case 'file':
      uiType = UI_UPLOADER;
      break;
    default:
      // OpenAPI Documentが正しければ処理がここに来ることはない。
      break;
    }
    return uiType;
  };

  // 使用するUIコンポーネント。
  this.uiType = getUIType();

  // textinput値が変更された時の処理。
  this.handleTextinputChange = newText => {
    this.opts.onchange(newText);
  };
}
