import append from 'mout/array/append';
import contains from 'mout/array/contains';
import deepClone from 'mout/lang/deepClone';
import ObjectAssign from 'object-assign';
import validator from '../validator';

export default function() {
  const schemaObject = this.schemaObject = this.opts.schemaobject;
  const itemsObject = this.opts.schemaobject.items;

  // ItemsObjectのtype値は"string", "number", "integer", "boolean", "array"のいずれか。
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#fixed-fields-8
  // OAS2.0仕様通りではないが、"object"と"null"も許可する。
  this.isFormMode = contains(['boolean', 'integer', 'number', 'null', 'string'], itemsObject.type);
  this.isPropertiesMode = (itemsObject.type === 'object');
  this.isItemsMode = (itemsObject.type === 'array');
  if (this.isFormMode) {
    const formObject = deepClone(itemsObject);
    this.formObject = formObject;
  }
  if (this.isPropertiesMode) {
    const propertiesObject = deepClone(itemsObject);
    this.propertiesObject = propertiesObject;
  }
  if (this.isItemsMode) {
    const _itemsObject = deepClone(itemsObject.items);
    this.itemsObject = _itemsObject;
  }
  // エラー関連。
  this.errors = [];
  this.hasError = false;
  const validate = () => {
    this.errors = validator.errors(this.opts.val, ObjectAssign({
      required: this.opts.required
    }, schemaObject));
    this.hasError = !!this.errors.length;
  };

  validate();
  this.on('update', () => {
    validate();
  });

  /**
   * item追加ボタンがタップされた時の処理。
   */
  this.handleAddButtonTap = () => {
    if (!this.opts.onchange) {
      return;
    }
    let ret = this.opts.val || [];
    let newItem = null;
    // type値によって作成する要素を分ける。
    // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#items-object
    // typeは"string", "number", "integer", "boolean", or "array"のいずれかと書いてあるが、"null"と"object"もプラスで想定する。
    // 追加分は先頭に。
    if (this.isFormMode) {
      newItem = undefined;
    } else if (this.isPropertiesMode) {
      newItem = {};
    } else if (this.isItemsMode) {
      newItem = [];
    }
    ret = append([newItem], ret);
    this.opts.onchange(this.opts.identifier, ret);
  };

  /**
   * item削除ボタンがタップされた時の処理。
   * @param {Object} e
   */
  this.handleRemoveButtonTap = e => {
    if (!this.opts.onchange) {
      return;
    }
    const idx = e.item.idx;
    let ret = this.opts.val;
    ret.splice(idx, 1);
    this.opts.onchange(this.opts.identifier, ret);
  };

  /**
   * 各itemが変更された時の処理。
   * @param {Number} idx
   * @param {*} newVal
   */
  this.handleItemChange = (idx, newVal) => {
    if (!this.opts.onchange) {
      return;
    }
    const ret = this.opts.val;
    ret[idx] = newVal;
    this.opts.onchange(this.opts.identifier, ret);
  };
}
