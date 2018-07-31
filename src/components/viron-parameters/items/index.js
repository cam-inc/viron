import append from 'mout/array/append';
import contains from 'mout/array/contains';
import forEach from 'mout/array/forEach';
import map from 'mout/array/map';
import times from 'mout/function/times';
import deepClone from 'mout/lang/deepClone';
import isArray from 'mout/lang/isArray';
import isBoolean from 'mout/lang/isBoolean';
import isNull from 'mout/lang/isNull';
import isObject from 'mout/lang/isObject';
import isUndefined from 'mout/lang/isUndefined';
import keys from 'mout/object/keys';
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
    if (!this.opts.onvalidate) {
      return;
    }
    this.opts.onvalidate(this._riot_id, !this.hasError);
  };

  // itemの開閉状態。
  this.itemsOpened = [];
  times((this.opts.val || []).length, idx => {
    this.itemsOpened[idx] = false;
  });

  validate();
  this.on('update', () => {
    validate();
  }).on('before-unmount', () => {
    this.opts.onvalidate(this._riot_id, true);
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
   * 簡易表示のタイトル部を返します。
   * @param {*} val
   * @param {Number} idx
   * @return {String}
   */
  this.getBriefItemTitle = (val, idx) => {
    if (this.isFormMode) {
      switch (this.formObject.type) {
      case 'string':
        return val || '-';
      case 'number':
      case 'integer':
        return isUndefined(val) ? '-' : String(val);
      case 'boolean':
        return isBoolean(val) ? String(val) : '-';
      case 'file':
        return 'file';
      case 'null':
        return isNull(val) ? 'null' : '-';
      default:
        return '-';
      }
    }
    if (this.isPropertiesMode) {
      // 最初にundefinedではない要素値を使用します。
      let ret;
      val = val || {};
      const properties = this.propertiesObject.properties;
      const _keys = keys(properties);
      forEach(_keys, key => {
        if (!isUndefined(ret)) {
          return;
        }
        if (isUndefined(val[key])) {
          return;
        }
        if (isObject(val[key])) {
          ret = '{Object}';
        } else if (isArray(val[key])) {
          ret = '[Array]';
        } else {
          ret = String(val[key]);
        }
      });
      if (!ret) {
        ret = '-';
      }
      return ret;
    }
    if (this.isItemsMode) {
      return `[${idx}]`;
    }
    return '-';
  };

  /**
   * 簡易表示のボディ部を返します。
   * @param {*} val
   * @return {String}
   */
  this.getBriefItemDescription = val => {
    if (!this.isPropertiesMode) {
      return '-';
    }
    let ret = '';
    val = val || {};
    const properties = this.propertiesObject.properties;
    const _keys = keys(properties);
    forEach(_keys, key => {
      const k = properties[key].description || key;
      let v = '-';
      if (!isUndefined(val[key])) {
        if (isObject(val[key])) {
          v = '{Object}';
        } else if (isArray(val[key])) {
          v = '[Array]';
        } else {
          v = String(val[key]);
        }
      }
      ret = `${ret} ${k}:${v}`;
    });
    return ret;
  };

  /**
   * item追加ボタンがタップされた時の処理。
   */
  this.handleAddButtonTap = () => {
    if (this.opts.ispreview) {
      return;
    }
    if (!this.opts.onchange) {
      return;
    }
    let ret = this.opts.val || [];
    let newItem = null;
    // type値によって作成する要素を分ける。
    // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#items-object
    // typeは"string", "number", "integer", "boolean", or "array"のいずれかと書いてあるが、"null"と"object"もプラスで想定する。
    // 追加分は末尾に。
    if (this.isFormMode) {
      newItem = this.formObject.default;
    } else if (this.isPropertiesMode) {
      newItem = util.generateDefaultProperties(this.propertiesObject);
    } else if (this.isItemsMode) {
      newItem = [];
    }
    ret = append(ret, [newItem]);
    this.itemsOpened = append(this.itemsOpened, [false]);
    this.update();
    this.opts.onchange(this.opts.identifier, ret);
  };

  /**
   * 上に移動ボタンがタップされた時の処理。
   * @param {Object} e
   */
  this.handleMoveUpTap = e => {
    e.stopPropagation();
    const idx = e.item.idx;
    let ret = this.opts.val;
    const item = ret.splice(idx, 1)[0];
    const opened = this.itemsOpened.splice(idx, 1)[0];
    ret.splice(idx - 1, 0, item);
    this.itemsOpened.splice(idx - 1, 0, opened);
    this.update();
    this.opts.onchange(this.opts.identifier, ret);
  };

  /**
   * 下に移動ボタンがタップされた時の処理。
   * @param {Object} e
   */
  this.handleMoveDownTap = e => {
    e.stopPropagation();
    const idx = e.item.idx;
    let ret = this.opts.val;
    const item = ret.splice(idx, 1)[0];
    const opened = this.itemsOpened.splice(idx, 1)[0];
    ret.splice(idx + 1, 0, item);
    this.itemsOpened.splice(idx + 1, 0, opened);
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
    if (this.opts.ispreview) {
      return;
    }
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
    this.itemsOpened[idx] = false;
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
   * When each item is submitted.
   * @param {Number} idx
   * @param {*} newVal
   */
  this.handleItemSubmit = (idx, newVal) => {
    if (!this.opts.onsubmit) {
      return;
    }
    const ret = this.opts.val;
    ret[idx] = newVal;
    this.opts.onsubmit(this.opts.identifier, ret);
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
    if (isUndefined(newVal)) {
      if (this.isFormMode) {
        ret[idx] = newVal;
      } else if (this.isPropertiesMode) {
        // Do nothing.
      } else if (this.isItemsMode) {
        ret[idx] = [];
      }
    } else {
      ret[idx] = newVal;
    }
    this.opts.onchange(this.opts.identifier, ret);
  };

  /**
   * バリデートされた時の処理。
   * @param {String} formId
   * @param {Boolean} isValid
   */
  this.handleItemValidate = (formId, isValid) => {
    if (!this.opts.onvalidate) {
      return;
    }
    this.opts.onvalidate(formId, isValid);
  };
}
