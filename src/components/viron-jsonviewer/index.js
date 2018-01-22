import isArray from 'mout/lang/isArray';
import isNull from 'mout/lang/isNull';
import isObject from 'mout/lang/isObject';
import isUndefined from 'mout/lang/isUndefined';
import isFunction from 'mout/lang/isFunction';
import isString from 'mout/lang/isString';
import isNumber from 'mout/lang/isNumber';
import isBoolean from 'mout/lang/isBoolean';
import forEach from 'mout/array/forEach';
import forOwn from 'mout/object/forOwn';


export default function() {
  const renderHtml = data => {
    let ret = '';

    // undefinedの場合
    if (isUndefined(data)) {
      ret = 'undefined';
      return ret;
    }

    // nullの場合
    if (isNull(data)) {
      ret = 'null';
      return ret;
    }

    // 関数の場合
    if (isFunction(data)) {
      ret = 'f()';
      return ret;
    }

    // 文字列の場合
    if (isString(data)) {
      ret = `"${data}"`;
      return ret;
    }

    // Numberの場合
    if (isNumber(data)) {
      ret = `${data}`;
      return ret;
    }

    // Booleanの場合
    if (isBoolean(data)) {
      ret = `${data}`;
      return ret;
    }

    // 配列の場合
    if (isArray(data)) {
      ret += '<div>[</div>';
      forEach(data, (val, idx) => {
        ret += `<div>${idx}:</div>`;
        ret += `<div>${renderHtml(val)}</div>`;
      });
      ret += '<div>]</div>';
      return ret;
    }

    // オブジェクトの場合
    if (isObject(data)) {
      ret += '<div>';
      forOwn(data, (val, key) => {
        ret += `<div>${key} : ${renderHtml(val)}</div>`;
      });
      ret += '</div>';
      return ret;
    }

    // レンダリングされたhtmlを返す
    return ret;
  };

  const update = () => {
    const canvasElm = this.refs.canvas;
    if (!canvasElm) {
      return;
    }
    const html = renderHtml(this.opts.data || {});
    canvasElm.innerHTML = html;
  };

  this.on('mount', () => {
    update();
  }).on('updated', () => {
    update();
  });
}
