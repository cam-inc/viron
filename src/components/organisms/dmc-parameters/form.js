import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
import isNumber from 'mout/lang/isNumber';
import hasOwn from 'mout/object/hasOwn';
import ObjectAssign from 'object-assign';

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

export default function() {
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#fixed-fields-7
  const schemaObject = ObjectAssign({}, this.opts.schemaobject);

  // wyswygエディタのオプション群。
  this.blotOptions = schemaObject['x-wyswyg-options'] || {};

  /**
   * 入力可否をチェックします。
   * @return {Boolean}
   */
  this.checkIsDisabled = () => {
    const additionalInfo = this.opts.additionalinfo;
    // primaryキーがpathに含まれており、且つ入力対象keyが同一の場合。
    // get, post, put, deleteいかなるメソッドでも入力不可能にする。
    if (schemaObject.in === 'path' && schemaObject.name === additionalInfo.primaryKey) {
      return true;
    }
    // 特に問題なければ入力可能。
    return false;
  };
  // 入力可能 or not。
  this.isDisabled = this.checkIsDisabled();

  /**
   * Selectコンポーネントに使用するoption群を返します。
   * @return {Array}
   */
  this.getSelectOptions = () => {
    const options = [];
    if (this.opts.val === undefined) {
      options.push({
        label: '-- select an option --',
        isSelected: true,
        isDiabled: true
      });
    }
    forEach(schemaObject.enum, (v, idx) => {
      options.push({
        id: `select_${idx}`,
        label: v,
        isSelected: (v === this.opts.val)
      });
    });
    return options;
  };

  /**
   * SchemaObjectの値から適切なUIコンポーネントを推測します。
   * @param {Object} schemaObject
   * @return {String}
   */
  const inferUITypeBySchemaObject = schemaObject => {
    // type値はnull/boolean/number/string/integerのいずれか。
    // typeが`array`や`object`の時にform.tagが使用されることは無い。
    // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.25
    if (!!schemaObject.enum) {
      return UI_SELECT;
    }

    const type = schemaObject.type;
    const format = schemaObject.format;
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
  };
  // 使用するUIコンポーネント名。
  this.uiType = inferUITypeBySchemaObject(schemaObject);

  this.on('mount', () => {
    // opts.valが何も指定されていない(i.e. undefined)
    // 且つ
    // デフォルト値が設定されていれば自動更新する。
    if (this.opts.val === undefined && hasOwn(schemaObject, 'default')) {
      this.opts.onchange(schemaObject.default);
    }
  });

  // textinput値が変更された時の処理。
  this.handleTextinputChange = newText => {
    if (!newText) {
      newText = undefined;
    }
    this.opts.onchange(newText);
  };

  // textarea値が変更された時の処理。
  this.handleTextareaChange = newText => {
    if (!newText) {
      newText = undefined;
    }
    this.opts.onchange(newText);
  };

  // numberinput値が変更された時の処理。
  this.handleNumberinputChange = newNumber => {
    if (!isNumber(newNumber)) {
      newNumber = undefined;
    }
    this.opts.onchange(newNumber);
  };

  // checkbox値が変更された時の処理。
  this.handleCheckboxChange = newIsChecked => {
    this.opts.onchange(newIsChecked);
  };

  // select値が変更された時の処理。
  this.handleSelectChange = options => {
    const option = find(options, option => {
      return option.isSelected;
    });
    const value = (option ? option.label : undefined);
    this.opts.onchange(value);
  };

  // uploader値が変更された時の処理。
  this.handleUploaderFileChange = newFile => {
    this.opts.onchange(newFile);
  };

  // wyswyg値が変更された時の処理。
  this.handleWyswygChange = innerHtml => {
    this.opts.onchange(innerHtml);
  };

  // pug値が変更された時の処理。
  this.handlePugChange = newText => {
    if (!newText) {
      newText = undefined;
    }
    this.opts.onchange(newText);
  };

  // html値が変更された時の処理。
  this.handleHtmlChange = newText => {
    if (!newText) {
      newText = undefined;
    }
    this.opts.onchange(newText);
  };
}
