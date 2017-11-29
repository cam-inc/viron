import append from 'mout/array/append';
import contains from 'mout/array/contains';
import map from 'mout/array/map';
import times from 'mout/function/times';
import deepClone from 'mout/lang/deepClone';
import ObjectAssign from 'object-assign';
import util from '../util';
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

  // itemの開閉状態。
  this.itemsOpened = [];
  times((this.opts.val || []).length, idx => {
    this.itemsOpened[idx] = false;
  });

  validate();
  this.on('update', () => {
    validate();
  });

  /**
   * 指定idxのitemの開閉状態を調べます。
   * @param {Number} idx
   * @return {Boolean}
   */
  this.isItemOpened = idx => {
    return this.itemsOpened[idx];
  };

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
      newItem = this.formObject.default;
    } else if (this.isPropertiesMode) {
      newItem = util.generateDefaultProperties(this.propertiesObject);
    } else if (this.isItemsMode) {
      newItem = util.generateDefaultItem(this.schemaObject) || [];
    }
    ret = append([newItem], ret);
    this.itemsOpened = append([true], this.itemsOpened);
    this.update();
    this.opts.onchange(this.opts.identifier, ret);
  };

  /**
   * 全てのアイテムを開くボタンがタップされた時の処理。
   */
  this.handleOpenAllButtonTap = () => {
    this.itemsOpened = map(this.itemsOpened, () => {
      return true;
    });
    this.update();
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
    if (!ret.length) {
      ret = undefined;
    }
    this.itemsOpened.splice(idx, 1);
    this.update();
    this.opts.onchange(this.opts.identifier, ret);
  };

  /**
   * とじるボタンがタップされた時の処理。
   * @param {Object} e
   */
  this.handleCloseButtonTap = e => {
    const idx = e.item.idx;
    this.itemsOpened[idx] = !this.itemsOpened[idx];
    this.update();
  };

  /**
   * 簡易表示要素がタップされた時の処理。
   * @param {Object} e
   */
  this.handleItemBriefTap = e => {
    const idx = e.item.idx;
    this.itemsOpened[idx] = true;
    this.update();
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
