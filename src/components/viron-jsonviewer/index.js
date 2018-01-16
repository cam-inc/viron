import isArray from 'mout/lang/isArray';
import isNull from 'mout/lang/isNull';
import isObject from 'mout/lang/isObject';
import isUndefined from 'mout/lang/isUndefined';
import isFunction from 'mout/lang/isFunction';
import isString from 'mout/lang/isString';
import isNumber from 'mout/lang/isNumber';
import isBoolean from 'mout/lang/isBoolean';
import forEach from 'mout/array/forEach';

export default function() {

  const createJson = obj => {

    // undefinedの場合
    if (isUndefined(obj)) {
      return 'undefined';
    }

    // nullの場合
    if (isNull(obj)) {
      return 'null';
    }

    // 関数の場合
    if (isFunction(obj)) {
      return 'f ()';
    }

    // 文字列の場合
    if (isString(obj)) {
      return `"${obj}"`;
    }

    // 配列の場合
    if (isArray(obj)) {

      const items = [];
      if (obj.length) {
        forEach(obj, (item, idx ) => {
          // 再帰処理
          items.push(createJson(item));
        });
      }
      return `<div class="Jsonviewer__array">[${items}]</div>`;
    }

    // オブジェクトの場合
    if (isObject(obj)) {
      const keys = Object.keys(obj);

      // オブジェクトが空の場合
      if (!keys.length) {
        return '{}';
      }

      let items = '';
      // TODO: moutで書き直す
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key || !isUndefined(obj[key])|| !isFunction(key) || !isFunction(obj[key])) {
          const isLast = (i === keys.length -1);
          const arrayble = isArray(obj[key]);
          const comma = !isLast ? ',' : '';
          const collapsible = arrayble ? 'Jsonviewer__item--collapsible' : ''
          items += `<div class="Jsonviewer__item ${collapsible}">${createJson(key)} : ${createJson(obj[key])}${comma}</div>`;
        }
      }
      return `<div class="Jsonviewer__objects"> + {${items}}</div>`;
    }

    // Number, Boolean
    return obj;
  };

  this.on('mount', () => {
    const obj = this.opts.data;
    this.refs.target.innerHTML = createJson(obj);
  });
}
