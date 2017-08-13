import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
import hasOwn from 'mout/object/hasOwn';
import ObjectAssign from 'object-assign';
import oas from '../../../core/oas';

const UI_TEXTINPUT = 'textinput';
const UI_NUMBERINPUT = 'numberinput';
const UI_CHECKBOX = 'checkbox';
const UI_SELECT = 'select';
const UI_DATEPICKER = 'datepicker';
const UI_UPLOADER = 'uploader';
const UI_NULL = 'null';

// TODO: schemaObject or schemaObjectLikeのみを受け取るようにしたい。
export default function() {
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#fixed-fields-7
  const schemaObject = ObjectAssign({}, this.opts.schemaobject);
  this.enum = schemaObject.enum;
  this.name = schemaObject.name;
  this.description = schemaObject.description;
  this.required = schemaObject.required;
  this.type = schemaObject.type;
  this.example = schemaObject.example;
  this.multipleOf = hasOwn(schemaObject, 'multipleOf') && String(schemaObject.multipleOf);
  this.maximum = hasOwn(schemaObject, 'maximum') && String(schemaObject.maximum);
  this.exclusiveMaximum = hasOwn(schemaObject, 'exclusiveMaximum') && String(schemaObject.exclusiveMaximum);
  this.minimum = hasOwn(schemaObject, 'minimum') && String(schemaObject.minimum);
  this.exclusiveMinimum = hasOwn(schemaObject, 'exclusiveMinimum') && String(schemaObject.exclusiveMinimum);
  this.maxLength = hasOwn(schemaObject, 'maxLength') && String(schemaObject.maxLength);
  this.minLength = hasOwn(schemaObject, 'minLength') && String(schemaObject.minLength);
  this.pattern = hasOwn(schemaObject, 'pattern') && String(schemaObject.pattern);

  /**
   * バリデートエラー項目群を返します。
   * @return {Array}
   */
  this.getValidateErrors = () => {
    return oas.validate(this.opts.val, schemaObject);
  };

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
    forEach(this.enum, (v, idx) => {
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
        return UI_DATEPICKER;
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

  // infoの開閉状態。
  this.isInfoOpened = true;
  // validateの開閉状態。
  this.isValidateOpened = true;
  // bodyの開閉状態。
  this.isBodyOpened = true;

  // infoの開閉ボタンがタップされた時の処理。
  this.handleInfoOpenShutButtonTap = () => {
    this.isInfoOpened = !this.isInfoOpened;
    this.update();
  };

  // validateの開閉ボタンがタップされた時の処理。
  this.handleValidateOpenShutButtonTap = () => {
    this.isValidateOpened = !this.isValidateOpened;
    this.update();
  };

  // bodyの開閉ボタンがタップされた時の処理。
  this.handleBodyOpenShutButtonTap = () => {
    this.isBodyOpened = !this.isBodyOpened;
    this.update();
  };

  // nameがタップされた時の処理。
  this.handleNameTap = () => {
    this.isBodyOpened = !this.isBodyOpened;
    this.update();
  };

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
    this.opts.onchange(newText);
  };

  // numberinput値が変更された時の処理。
  this.handleNumberinputChange = newNumber => {
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
}
