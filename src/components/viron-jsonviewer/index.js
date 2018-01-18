import isArray from 'mout/lang/isArray';
import isNull from 'mout/lang/isNull';
import isObject from 'mout/lang/isObject';
import isUndefined from 'mout/lang/isUndefined';
import isFunction from 'mout/lang/isFunction';
import isString from 'mout/lang/isString';
import forEach from 'mout/array/forEach';

export default function() {
  const createJson = (obj, opts = {}) => {

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
      // 空の場合
      if (!obj.length) {
        return `[${items}]`;
      }
      forEach(obj, item => {
        // 再帰処理
        items.push(createJson(item));
      });
      return `[${items}]`;
    }

    // オブジェクトの場合
    if (isObject(obj)) {
      const keys = Object.keys(obj);
      // 空の場合
      if (!keys.length) {
        return '{}';
      }
      // TODO: moutで書き直す
      let items = '';
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key || !isUndefined(obj[key])|| !isFunction(key) || !isFunction(obj[key])) {
          const isLast = (i === keys.length -1);
          const comma = !isLast ? ',' : '';
          const unfoldable = isArray(obj[key]) ? '--unfoldable' : '';
          items += `<div class="Jsonviewer__item Jsonviewer__item${unfoldable}">${createJson(key)} : ${createJson(obj[key])}${comma}</div>`;
        }
      }

      return `<div class="Jsonviewer__objects ${opts.isRoot ? 'Jsonviewer__objects--rootable': 'Jsonviewer__objects--unfoldable'}">{${items}}</div>`;
    }
    // その他の場合 eg. Boolean, Number
    return obj;
  };

  this.on('mount', () => {
    const obj = this.opts.data;
    this.refs.target.innerHTML = createJson(obj, {
      isRoot: true
    });
  });
}
