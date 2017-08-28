import BigNumber from 'bignumber.js';
import Color from 'color';
import isNull from 'mout/lang/isNull';
import isUndefined from 'mout/lang/isUndefined';

const COLOR_CODE = {
  HEX: 'HEX',
  RGBA: 'RGBA'
};

export default function() {
  /**
   * 値がHEXか判定します。
   * シャープはついていてもいなくてもtrueを返します。
   * @param {String} value 
   * @return {Boolean}
   */
  const isHex = value => {
    const isMatch = value.match(/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/);
    return isMatch;
  };

  // カラーコード切り替えボタンのときの表示
  this.isColorChangeButtonActive = false;
  // 選択可能カラーコードが選択されていない場合、全種類のカラーコードを選択可能とする
  let selectableColorCode = this.opts.selectablecolorcode || { HEX: true, RGBA: true };
  // カラーデータを取得する
  this.color = this.opts.color || {format: COLOR_CODE.HEX, value: ''};
  // 選択可能カラーコードの中の当該カラーデータが有効になっていない場合それを選択可能にする
  if (!selectableColorCode[this.color.format]) {
    selectableColorCode[this.color.format] = true;
  }
  // 最後に色と認識された値を格納する
  let lastValidColor = '#000000';

  this.on('update', () => {
    selectableColorCode = this.opts.selectablecolorcode || {HEX: true, RGBA: true};
    this.color = this.opts.color || {format: COLOR_CODE.HEX, value: ''};
    // 正しい色であれば最新の正しい色として残す
    if (this.color.format === COLOR_CODE.HEX && isHex(this.color.value)) {
      lastValidColor = this.color.value;
    }
  }).on('updated', () => {
    if (this.color.format === COLOR_CODE.HEX && this.opts.isshown) {
      this.refs.inputHex.value = this.color.value;
    }
  });

  /**
   * 表示カラーコードを切り替える
   */
  this.handleColorChangeButtonTap = () => {
    const order = [COLOR_CODE.HEX, COLOR_CODE.RGBA];
    const color = { format: COLOR_CODE.HEX, value: '' };
    let index = order.indexOf(this.color.format);
    if (index !== -1) {
      do {
        index = (index !== order.length - 1) ? index + 1 : 0;
      } while (!selectableColorCode[order[index]]);
      color.format = order[index];
      color.value = convertColor(this.color.format, this.color.value, color.format);
    }

    this.opts.oncolorchange(color);
  };

  this.handleInputTap = () => {
    this.opts.ontoggle(!this.opts.isshown);
  };

  this.handleColorChangeButtonTouchStart = () => {
    this.isColorChangeButtonActive = true;
  };

  this.handleColorChangeButtonTouchEnd = () => {
    this.isColorChangeButtonActive = false;
  };

  this.handleColorChangeButtonMouseOver = () => {
    this.isColorChangeButtonActive = true;
  };

  this.handleColorChangeButtonMouseOut = () => {
    this.isColorChangeButtonActive = false;
  };

  /**
   * HEX入力値のイベントリスナーハンドラー
   */
  this.handleInputHexInput = e => {
    let newColor = e.target.value;// eslint-disable-line no-irregular-whitespace
    newColor = normalizeHexValue(newColor);

    const color = {
      format: this.color.format,
      value: newColor
    };
    
    this.opts.oncolorchange(color);
  };

  /**
   * Red入力値のイベントリスナーハンドラー
   */
  this.handleInputRgbaRedInput = value => {
    const colorValue = value || 0;
    const color = {
      format: this.color.format,
      value: this.color.value
    };
    color.value.r = colorValue;

    this.opts.oncolorchange(color);
  };

  /**
   * Green入力値のイベントリスナーハンドラー
   */
  this.handleInputRgbaGreenInput = value => {
    const colorValue = value || 0;
    const color = {
      format: this.color.format,
      value: this.color.value
    };
    color.value.g = colorValue;

    this.opts.oncolorchange(color);
  };

  /**
   * Blue入力値のイベントリスナーハンドラー
   */
  this.handleInputRgbaBlueInput = value => {
    const colorValue = value || 0;
    const color = {
      format: this.color.format,
      value: this.color.value
    };
    color.value.b = colorValue;

    this.opts.oncolorchange(color);
  };

  /**
   * Alpha入力値のイベントリスナーハンドラー
   */
  this.handleInputAlphaInput = value => {
    const colorValue = value || 0;
    const color = {
      format: this.color.format,
      value: this.color.value
    };
    color.value.a = new BigNumber(colorValue).div(100).toString() || 0;

    this.opts.oncolorchange(color);
  };

  /**
   * 表示用のカラースタイルを返却します。
   * @return {String}
   */
  this.generateColorStyle = () => {
    let style = '';
    switch (this.color.format) {
    case COLOR_CODE.HEX:
      style = (isHex(this.color.value)) ? concatenatePoundKey(this.color.value) : lastValidColor;
      break;
    case COLOR_CODE.RGBA:
      style = `rgba(${this.color.value.r},${this.color.value.g},${this.color.value.b},${this.color.value.a})`;
      break;
    default:
      break;
    }

    return style;
  };

  /**
   * readonlyのinputの値を表示します。
   */
  this.generateDummyValue = () => {
    let style = '';
    switch (this.color.format) {
    case COLOR_CODE.HEX:
      style = concatenatePoundKey(this.color.value);
      break;
    case COLOR_CODE.RGBA:
      style = `${this.color.value.r},${this.color.value.g},${this.color.value.b},${this.color.value.a}`;
      break;
    default:
      break;
    }

    return style;
  };

  /**
   * 表示用のRGB値を返却します。
   * @return {String}
   */
  this.generateRgbaValue = primaryColor => {
    let param = null;
    switch (primaryColor) {
    case 'red':
      param = this.color.value.r;
      break;
    case 'green':
      param = this.color.value.g;
      break;
    case 'blue':
      param = this.color.value.b;
      break;
    default:
      break;
    }

    if (isNull(param)) {
      return '';
    }
    return param;
  };

  /**
   * 表示用のAlpha値を返却します。
   * @return {String}
   */
  this.generateAlphaValue = () => {
    let param = this.color.value.a;
    // 少数の値を変換しているため、ライブラリを使用する
    if (isNull(param)) {
      return 1;
    }
    return new BigNumber(param).times(100).round(2).toString();
  };

  /**
   * HEXの値が正しくなるよう変更をかけます
   * @param {*} value 
   */
  const normalizeHexValue = value => {
    value = value.replace(/　/g, ' ');// eslint-disable-line no-irregular-whitespace

    if (isNull(value)) {
      return value;
    }

    if (isUndefined(value)) {
      return null;
    }
    
    // 正しいフォーマットだがシャープをつけていない場合、頭にシャープをつける
    if (isHex(value)) {
      value = concatenatePoundKey(value);
    }
    
    // HEXでなければ変更前の文字列に戻す
    if (!isTypingHex(value)) {
      value = this.opts.color.value;
    }

    return value;
  };

  /**
   * 値がHEXか判定します。
   * 入力用なため、16進数を3,6文字に限定するのではなく
   * 1~6文字以内で許容します。
   * @param {String} value 
   * @return {Boolean}
   */
  const isTypingHex = value => {
    const isMatch = value.match(/^#?[0-9A-Fa-f]{0,6}$/);
    return isMatch;
  };  

  /**
   * 井桁がついていない場合、井桁を頭につけます。
   * @param {String} value 
   * @return {String}
   */
  const concatenatePoundKey = value => {
    const isIncludeSharp = value.match('^#');
    if (isNull(isIncludeSharp)) {
      value = `#${value}`;
    }
    return value;
  };

  /**
   * カラーを変換します
   * @param {String} colorCode
   * @param {String} colorValue
   * @param {String} exportColorcode 
   * @return {String}
   */
  const convertColor = (colorCode, colorValue, exportColorcode) => {
    let colorObj = {};
    if (colorCode === COLOR_CODE.HEX) {
      colorObj = (isHex(colorValue)) ? Color(concatenatePoundKey(colorValue)) : Color(concatenatePoundKey(lastValidColor));
    }
    if (colorCode === COLOR_CODE.RGBA) {
      colorObj = Color.rgb(colorValue.r, colorValue.g, colorValue.b).alpha(colorValue.a);
    }

    if (exportColorcode === COLOR_CODE.HEX) {
      return colorObj.hex();
    }
    if (exportColorcode === COLOR_CODE.RGBA) {
      const color = colorObj.object();
      color.a = colorObj.alpha();
      return color;
    }
  };
}