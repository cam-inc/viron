import isNaN from 'mout/lang/isNaN';
import isNull from 'mout/lang/isNull';
import _isNumber from 'mout/lang/isNumber';
import isString from 'mout/lang/isString';
import isUndefined from 'mout/lang/isUndefined';

export default function() {
  /**
   * moutの`isNumber`のラッパー関数。
   * moutの`isNumber`にNaNを渡すと`true`が返却される(想定外)ので、NaNでも`false`を返すように調整しています。
   * @param {*} num
   */
  const isNumber = num => {
    if (isNaN(num)) {
      return false;
    }
    return _isNumber(num);
  };
  // opts文字列指定も許可する。
  let min, max, step;
  min = Number(this.opts.min);
  max = Number(this.opts.max);
  step = Number(this.opts.step);
  min = (isNumber(min) ? min : null);
  max = (isNumber(max) ? max : null);
  step = (isNumber(step) ? step : null);

  /**
   * 現在値を指定step数分インクリメントして返却します。
   * @return {Number}
   */
  const increment = () => {
    const currentValue = this.normalizeValue(this.opts.number);
    const n = isNumber(step) ? step : 1;
    let newValue;
    if (isNull(currentValue)) {
      newValue = n;
    } else {
      newValue = currentValue + n;
    }
    return this.normalizeValue(newValue);
  };

  /**
   * 現在値を指定step数分デクリメントして返却します。
   * @return {Number}
   */
  const decrement = () => {
    const currentValue = this.normalizeValue(this.opts.number);
    const n = isNumber(step) ? step : 1;
    let newValue;
    if (isNull(currentValue)) {
      newValue = n * (-1);
    } else {
      newValue = currentValue - n;
    }
    return this.normalizeValue(newValue);
  };

  /**
   * nullやundefined等を考慮した上で最適な値を返します。
   * @param {Number|String|null|undefined} value
   * @return {Number|null}
   */
  this.normalizeValue = value => {
    // nullの場合はそのまま扱う。
    if (isNull(value)) {
      return value;
    }

    // undefined時はnullとして扱う。
    if (isUndefined(value)) {
      return null;
    }

    // 文字列を受け取った場合は形式によって返却値が変わる。
    if (isString(value)) {
      // 数字と`-`のみも文字列に変換する。
      value = value.replace(/[^-^0-9]/g, '');
      // 空文字列の場合はnullとして扱う。
      if (!value.length) {
        return null;
      }
      // 数値に変換する。
      // `-12` -> 12
      // `0012` -> 12
      // `1-2` ->  NaN
      value = Number(value);
      // NaNはnullとして扱う。
      if (isNaN(value)) {
        return null;
      }
    }

    // この時点で`validValue`は必ずNumberとなる。

    // 最大値が設定されている 且つ 最大値を超えているケースへの対応。
    if (isNumber(max) && value > max) {
      value = max;
    }
    // 最小値が設定されている 且つ 最小値より小さいケースへの対応。
    if (isNumber(min) && value < min) {
      value = min;
    }

    return value;
  };

  /**
   * インクリメント可能かチェックします。
   * @return {Boolean}
   */
  this.isIncrementable = () => {
    // 最大値が設定されていなければ常にincrement可能とする。
    if (!isNumber(max)) {
      return true;
    }
    const incrementedValue = increment();
    if (incrementedValue > max) {
      return false;
    } else {
      return true;
    }
  };

  /**
   * デクリメント可能かチェックします。
   * @return {Boolean}
   */
  this.isDecrementable = () => {
    // 最小値が設定されていなければ常にincrement可能とする。
    if (!isNumber(min)) {
      return true;
    }
    const decrementedValue = decrement();
    if (decrementedValue < min) {
      return false;
    } else {
      return true;
    }
  };

  // @see: https://developer.mozilla.org/ja/docs/Web/API/Element/setAttribute
  // setAttribute() を使ってある属性、XUL や HTML の特別な値、および HTML の選択領域の変更は、属性がデフォルト値を特定している場合に一貫性の無い動作となります。現在の値にアクセスしたり、変更したりするにはプロパティを使用すべきです。具体例として、 elt .setAttribute('value', val ) の代わりに elt .value を使用します。
  this.on('mount', () => {
    this.refs.input.value = this.normalizeValue(this.opts.number);
    // 初期値の誤りを正すために初回のみonchangeを実行する。
    // 例えば、min=50 number=10の場合は新number`50`でonchangeが実行される。
    this.opts.onchange(this.normalizeValue(this.opts.number));
  }).on('updated', () => {
    this.refs.input.value = this.normalizeValue(this.opts.number);
  });

  /**
   * form要素でkeyイベントが発生した際の処理。
   * @param {Object} e
   */
  this.handleFormKeyDown = e => {
    e.preventUpdate = true;
    switch (e.code) {
    case 'ArrowUp':
      this.opts.onchange(increment());
      break;
    case 'ArrowDown':
      this.opts.onchange(decrement());
      break;
    default:
      break;
    }
  };

  /**
   * input値に変更があった際の処理。
   * @param {Object} e
   */
  this.handleInputChange = e => {
    e.preventUpdate = true;
    // input要素のchangeイベントは不安定に発火するのでイベント伝播を止める役割にとどめます。
    e.stopPropagation();
  };

  /**
   * input値に変更があった際の処理。
   * @param {Object} e
   */
  this.handleInputInput = e => {
    e.preventUpdate = true;
    this.opts.onchange(this.normalizeValue(e.target.value));
  };

  /**
   * increaseボタンがタップされた時の処理。
   */
  this.handleIncreaseButtonClick = () => {
    // ボタンが押されたとき、inputにフォーカスすることで、矢印ボタンでも加減できるようにする
    this.refs.input.focus();
    this.opts.onchange(increment());
  };

  /**
   * decreaseボタンがタップされた時の処理。
   */
  this.handleDecreaseButtonClick = () => {
    // ボタンが押されたとき、inputにフォーカスすることで、矢印ボタンでも加減できるようにする
    this.refs.input.focus();
    this.opts.onchange(decrement());
  };

}
