import contains from 'mout/array/contains';
import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
import isNumber from 'mout/lang/isNumber';
import isUndefined from 'mout/lang/isUndefined';
import util from '../util';
import validator from '../validator';

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
  // uploaderのaccept値。
  this.accept = formObject['x-accept'] || '*';
  // MIME-type
  this.mimeType = formObject['x-mime-type'];

  // disabled(readOnly)
  this.isDisabled = this.opts.isdisabled;
  if (formObject.readOnly) {
    this.isDisabled = true;
  }

  // 入力に使用するUIコンポーネント名。
  // opts.formObjectの値から適切なUIコンポーネントを推測します。
  // 文字列 & (previewモード || readOnly) & 拡張子imageの場合のみ強制的に画像を表示します。
  this.uiType = (() => {
    if ((!this.opts.ispreview && !formObject.readOnly) || formObject.type !== 'string' || !this.opts.val) {
      return util.getUIType(formObject);
    }
    // 拡張子から最適な表示方法を推測します。
    const split = this.opts.val.split('.');
    if (split.length < 2) {
      return util.getUIType(formObject);
    }
    const suffix = split[split.length - 1];
    // 画像系チェック。
    if (contains(['png', 'jpg', 'jpeg', 'gif'], suffix)) {
      return 'image';
    }
    return util.getUIType(formObject);
  })();

  // エラー関連。
  this.errors = [];
  this.hasError = false;
  const validate = () => {
    this.errors = validator.errors(this.opts.val, formObject);
    this.hasError = !!this.errors.length;
  };

  // フォーム選択状態。
  this.isFocus = false;

  /**
   * Selectコンポーネントの選択肢を返します。
   * @return {Array}
   */
  this.getSelectOptions = () => {
    const options = [];
    if (isUndefined(this.opts.val)) {
      options.push({
        label: '-- select an option --',
        value: undefined,
        isSelected: true,
        isDiabled: true
      });
    }
    forEach(formObject.enum, (v, idx) => {
      options.push({
        id: `select_${idx}`,
        label: v,
        value: v,
        isSelected: (v === this.opts.val)
      });
    });
    return options;
  };

  validate();
  this.on('update', () => {
    validate();
  });

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
   * フォーカスされた時の処理。
   */
  this.handleFormFocus = () => {
    this.isFocus = true;
    this.update();
  };

  /**
   * フォーカスが外れた時の処理。
   */
  this.handleFormBlur = () => {
    this.isFocus = false;
    this.update();
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
   * Base64: 入力値が変更された時の処理。
   * @param {String|null} newValue
   */
  this.handleBase64Change = newValue => {
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
      newText = Number(newText);
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
