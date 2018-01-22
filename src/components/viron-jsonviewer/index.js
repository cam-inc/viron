import isArray from 'mout/lang/isArray';
import isNull from 'mout/lang/isNull';
import isObject from 'mout/lang/isObject';
import isUndefined from 'mout/lang/isUndefined';
import isFunction from 'mout/lang/isFunction';
import isString from 'mout/lang/isString';
import _isNumber from 'mout/lang/isNumber';
import isBoolean from 'mout/lang/isBoolean';
import forEach from 'mout/array/forEach';
import forOwn from 'mout/object/forOwn';

const BlockName = 'Jsonviewer';

const isNumber = num => {
  if (isNaN(num)) {
    return false;
  }
  return _isNumber(num);
};

export default function() {
  const renderHtml = data => {
    let ret = '';

    // nullの場合
    if (isNull(data)) {
      ret = `<div class="${BlockName}__null">null</div>`;
      return ret;
    }

    // undefinedの場合
    if (isUndefined(data)) {
      ret = `<div class="${BlockName}__undefined">undefined</div>`;
      return ret;
    }

    // 関数の場合
    if (isFunction(data)) {
      ret = `<div class="${BlockName}__function">f()</div>`;
      return ret;
    }

    // Numberの場合
    if (isNumber(data)) {
      ret = `<div class="${BlockName}__number">${data}</div>`;
      return ret;
    }

    // Booleanの場合
    if (isBoolean(data)) {
      ret = `<div class="${BlockName}__boolean">${data}</div>`;
      return ret;
    }

    // 文字列の場合
    if (isString(data)) {
      ret = `<div class="${BlockName}__string">"${data}"</div>`;
      return ret;
    }

    // 配列の場合
    if (isArray(data)) {
      ret += `<div class="${BlockName}__array">`;
      ret += `<div class="${BlockName}__arrayPrefix">[</div>`;
      ret += `<div class="${BlockName}__container">`;
      forEach(data, (val, idx) => {
        ret += `<label class="${BlockName}__pair">`;
        if (isObject(val) || isArray(val)) {
          ret += `<input class="${BlockName}__toggle" type="checkbox" />`;
        }
        ret += `<div class="${BlockName}__idx">${idx}:</div>`;
        ret += `<div class="${BlockName}__value">${renderHtml(val)}</div>`;
        if (isObject(val)) {
          ret += `<div class="${BlockName}__dots">{...}</div>`;
        }
        if (isArray(val)) {
          ret += `<div class="${BlockName}__dots">[...]</div>`;
        }
        ret += '</label>';
      });
      ret += '</div>';
      ret += `<div class="${BlockName}__arraySuffix">]</div>`;
      ret += '</div>';
      return ret;
    }

    // オブジェクトの場合
    if (isObject(data)) {
      ret += `<div class="${BlockName}__object">`;
      ret += `<div class="${BlockName}__objectPrefix">{</div>`;
      ret += `<div class="${BlockName}__container">`;
      forOwn(data, (val, key) => {
        ret += `<label class="${BlockName}__pair">`;
        if (isObject(val) || isArray(val)) {
          ret += `<input class="${BlockName}__toggle" type="checkbox" />`;
        }
        ret += `<div class="${BlockName}__key">${key}:</div>`;
        ret += `<div class="${BlockName}__value">${renderHtml(val)}</div>`;
        if (isObject(val)) {
          ret += `<div class="${BlockName}__dots">{...}</div>`;
        }
        if (isArray(val)) {
          ret += `<div class="${BlockName}__dots">[...]</div>`;
        }
        ret += '</label>';
      });
      ret += '</div>';
      ret += `<div class="${BlockName}__objectSuffix">}</div>`;
      ret += '</div>';
      return ret;
    }

    // NaNの場合
    if (isNaN(data)) {
      ret = `<div class="${BlockName}__nan">NaN</div>`;
      return ret;
    }

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
