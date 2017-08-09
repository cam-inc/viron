import hasOwn from 'mout/object/hasOwn';
import ObjectAssign from 'object-assign';

const UI_TEXTINPUT = 'textinput';
const UI_CHECKBOX = 'checkbox';
const UI_SELECT = 'select';
const UI_DATEPICKER = 'datepicker';
const UI_UPLOADER = 'uploader';
const UI_NULL = 'null';

// TODO: schemaObject or schemaObjectLikeのみを受け取るようにしたい。
export default function() {
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#fixed-fields-7
  const parameterObject = ObjectAssign({}, this.opts.parameterobject);

  // TODO: validate

  // type値はnull/boolean/number/string/integerのいずれか。
  // typeが`array`や`object`の時にform.tagが使用されることは無い。
  // @see: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.25
  this.uiType = '';
  const type = parameterObject.type;
  const format = parameterObject.format;
  switch (type) {
  case 'string':
    switch (format) {
    case 'date-time':
      this.uiType = UI_DATEPICKER;
      break;
    default:
      this.uiType = UI_TEXTINPUT;
      break;
    }
    break;
  case 'number':
  case 'integer':
    this.uiType = UI_TEXTINPUT;
    break;
  case 'boolean':
    this.uiType = UI_CHECKBOX;
    break;
  case 'file':
    this.uiType = UI_UPLOADER;
    break;
  case 'null':
    this.uiType = UI_NULL;
    break;
  default:
    // OpenAPI Documentが正しければ処理がここに来ることはない。
    break;
  }

  //
  this.on('mount', () => {
    // opts.valが何も指定されていない(i.e. undefined)
    // 且つ
    // デフォルト値が設定されていれば自動更新する。
    if (this.opts.val === undefined && hasOwn(parameterObject, 'default')) {
      this.opts.onchange(parameterObject.default);
    }
  });

  // textinput値が変更された時の処理。
  this.handleTextinputChange = newText => {
    this.opts.onchange(newText);
  };
}
