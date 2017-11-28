import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
import isNumber from 'mout/lang/isNumber';
import isUndefined from 'mout/lang/isUndefined';
import util from '../util';

export default function() {
  // ショートカット。
  const formObject = this.opts.formobject;
  // 入力フォームのタイトル。
  // 入力必須ならば米印を付ける。
  this.title = formObject.description || formObject.name;
  if (formObject.required) {
    this.title = `${this.title} *`;
  }
  // autocomplete設定。
  this.autocompleteConfig = formObject['x-autocomplete'];

  // 入力に使用するUIコンポーネント名。
  // opts.formObjectの値から適切なUIコンポーネントを推測します。
  this.uiType = util.getUIType(formObject);

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
    forEach(formObject.enum, (v, idx) => {
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
    switch (formObject.type) {
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

  /**
   * Wyswyg: 入力値が変更された時の処理。
   * @param {String|null} newValue
   */
  this.handleWyswygChange = newValue => {
    // 文字列 or undefinedに強制変換。
    let ret;
    if (!newValue) {
      ret = undefined;
    } else {
      ret = newValue;
    }
    change(ret);
  };

}
