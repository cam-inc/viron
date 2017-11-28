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
  }

};
