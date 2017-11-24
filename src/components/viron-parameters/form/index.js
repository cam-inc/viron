import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
import isNumber from 'mout/lang/isNumber';
import isUndefined from 'mout/lang/isUndefined';

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

export default function() {
  // ショートカット。
  const data = this.opts.formdata;
  // 入力フォームのタイトル。
  // 入力必須ならば米印を付ける。
  this.title = data.description || data.name;
  if (data.required) {
    this.title = `${this.title} *`;
  }
  // autocomplete設定。
  this.autocompleteConfig = data['x-autocomplete'];

  // 入力に使用するUIコンポーネント名。
  // opts.dataの値から適切なUIコンポーネントを推測します。
  this.uiType = (() => {
    // typeが`array`や`object`の時にform.tagが使用されることは無い。
    // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.25
    // 選択肢があるとき。
    if (!!data.enum) {
      return UI_SELECT;
    }
    // autocomplete有効時。
    if (!!data['x-autocomplete']) {
      return UI_AUTOCOMPLETE;
    }
    const type = data.type;
    const format = data.format;
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
  })();

  /**
   * Selectコンポーネントの選択肢を返します。
   * @return {Array}
   */
  this.getSelectOptions = () => {
    const options = [];
    if (isUndefined(this.opts.val)) {
      options.push({
        label: '-- select an option --',
        isSelected: true,
        isDiabled: true
      });
    }
    forEach(data.enum, (v, idx) => {
      options.push({
        id: `select_${idx}`,
        label: v,
        isSelected: (v === this.opts.val)
      });
    });
    return options;
  };

  /**
   * changeイベントを発火します。
   * @param {*} value
   */
  const change = value => {
    if (!this.opts.onchange) {
      return;
    }
    this.opts.onchange(this.opts.identifier, value);
  };

  /**
   * Textinput: 入力値が変更された時の処理。
   * @param {String|null} newValue
   */
  this.handleTextinputChange = newValue => {
    // 文字列 or undefinedに強制変換。
    let ret;
    if (!newValue) {
      ret = undefined;
    } else {
      ret = newValue;
    }
    change(ret);
  };

  /**
   * Textarea: 入力値が変更された時の処理。
   * @param {String|null} newValue
   */
  this.handleTextareaChange = newValue => {
    // 文字列 or undefinedに強制変換。
    let ret;
    if (!newValue) {
      ret = undefined;
    } else {
      ret = newValue;
    }
    change(ret);
  };

  /**
   * Html: 入力値が変更された時の処理。
   * @param {String|null} newHtml
   */
  this.handleHtmlChange = newValue => {
    // 文字列 or undefinedに強制変換。
    let ret;
    if (!newValue) {
      ret = undefined;
    } else {
      ret = newValue;
    }
    change(ret);
  };

  /**
   * Pug: 入力値が変更された時の処理。
   * @param {String|null} newHtml
   */
  this.handlePugChange = newValue => {
    // 文字列 or undefinedに強制変換。
    let ret;
    if (!newValue) {
      ret = undefined;
    } else {
      ret = newValue;
    }
    change(ret);
  };

  /**
   * Numberinput: 入力値が変更された時の処理。
   * @param {Number|null} newValue
   */
  this.handleNumberinputChange = newValue => {
    // 数値 or undefinedに強制変換。
    let ret;
    if (!isNumber(newValue)) {
      ret = undefined;
    } else {
      ret = newValue;
    }
    change(ret);
  };

  /**
   * Checkbox: 入力値が変更された時の処理。
   * @param {Boolean} isChecked
   */
  this.handleCheckboxChange = isChecked => {
    change(isChecked);
  };

  /**
   * Select: 入力値が変更された時の処理。
   * @param {Array} newOptions
   */
  this.handleSelectChange = newOptions => {
    const option = find(newOptions, option => {
      return option.isSelected;
    });
    const value = (option ? option.label : undefined);
    change(value);
  };

  /**
   * Uploader: 入力値が変更された時の処理。
   * @param {File} newFile
   */
  this.handleUploaderChange = newFile => {
    let ret;
    if (!newFile) {
      ret = undefined;
    } else {
      ret = newFile;
    }
    change(ret);
  };

  /**
   * Autocomplete: 入力値が変更された時の処理。
   * @param {String} newText
   */
  this.handleAutocompleteChange = newText => {
    switch (data.type) {
    case 'string':
      if (!newText) {
        newText = undefined;
      }
      break;
    case 'number':
    case 'integer':
      // 数値 or undefinedに強制変換。
      if (!isNumber(newText)) {
        newText = undefined;
      }
      break;
    }
    change(newText);
  };
}
