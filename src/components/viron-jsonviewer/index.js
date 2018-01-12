import isArray from 'mout/lang/isArray';
import isNull from 'mout/lang/isNull';
import isObject from 'mout/lang/isObject';
import isUndefined from 'mout/lang/isUndefined';
import isFunction from 'mout/lang/isFunction';
import isString from 'mout/lang/isString';
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
      return 'F ()';
    }

    // 文字列の場合
    if (isString(obj)) {
      return `"${obj}"`;
    }

    // 配列の場合
    if (isArray(obj)) {

      // 配列が空の場合
      if (!obj.length) {
        return '[]';
      }

      const items = [];
      forEach(obj, item => {
        // 再帰処理
        items.push(createJson(item));
      });
      return `[<div>${items.join(',')}</dvi>]`;
    }

    // オブジェクトの場合
    if (isObject(obj)) {
      const keys = Object.keys(obj);

      // オブジェクトが空の場合
      if (!keys.length) {
        return '{}';
      }

      let items = '';
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key || !isUndefined(obj[key])|| !isFunction(key) || !isFunction(obj[key])) {
          const isLast = (i === keys.length -1);
          // 末尾のアイテムの場合にはテンプレートを切り替える
          items += isLast
            ? `<div>${createJson(key)} : ${createJson(obj[key])},</div>`
            : `<div>${createJson(key)} : ${createJson(obj[key])}</div>`;
        }
      }
      return `{${items}}`;
    }

    // Number, Booleanの場合
    return obj;
  };

  this.on('mount', () => {
    const obj = this.opts.data;
    this.refs.target.innerHTML = createJson(obj);
  });
}
