import BigNumber from 'bignumber.js';
import Color from 'color';
import isNull from 'mout/lang/isNull';
import _isNumber from 'mout/lang/isNumber';
import isUndefined from 'mout/lang/isUndefined';
import forIn from 'mout/object/forIn';

const COLOR_CODE = {
  HEX: 'HEX',
  RGBA: 'RGBA'
};

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

  /**
   * 値がRGBAか判定します。
   * @param {String} value 
   * @return {Boolean}
   */
  const isRgba = value => {
    let isValid = true;
    forIn(value, (val) => {
      if (val || !isNumber(Number(val))) {
        return false;
      }
    });
    return isValid;
  };

  /**
   * カラーオブジェクトへ変換します。
   * 指定していないフォーマットならばnullを返却します
   * @param {String} colorFormat 
   * @param {*} colorValue
   */
  const convertToColorInstance = (colorFormat, colorValue) => {
    let color = {};
    switch (colorFormat) {
    case COLOR_CODE.HEX:
      color.format = COLOR_CODE.HEX;
      color.value = (isHex(colorValue)) ? Color(colorValue) : '';
      break;
    case COLOR_CODE.RGBA:
      color.format = COLOR_CODE.RGBA;
      color.value = (isRgba(colorValue)) ? Color.rgb(colorValue.r, colorValue.g, colorValue.b).alpha(colorValue.a) : '';
      break;
    default:
      color = null;
      break;
    }
    return color;
  };

  // カラーコード切り替えボタンのときの表示
  this.isColorChangeButtonActive = false;
  // 選択可能カラーコードが選択されていない場合、全種類のカラーコードを選択可能とする
  let selectableColorCode = this.opts.selectablecolorcode || { HEX: true, RGBA: true };
  // カラーデータを取得し、オブジェクト化する
  this.color = convertToColorInstance(this.opts.color.format, this.opts.color.value);
  if (isNull(this.color)) {
    this.color.format = COLOR_CODE.HEX;
    this.colot.value = '';
  }
  // 選択可能カラーコードの中の当該カラーデータが有効になっていない場合それを選択可能にする
  if (!selectableColorCode[this.color.format]) {
    selectableColorCode[this.color.format] = true;
  }

  this.on('update', () => {
    selectableColorCode = this.opts.selectablecolorcode || {HEX: true, RGBA: true};
    this.color = convertToColorInstance(this.opts.color.format, this.opts.color.value);
  }).on('updated', () => {
    if (isNull(this.color)) {
      this.color.format = COLOR_CODE.HEX;
      this.colot.value = '';
    }
    if (this.color.format === COLOR_CODE.HEX && this.opts.isshown) {
      this.refs.inputHex.value = this.color.value.hex();
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
      color.value = convertColor(this.color.value, color.format);
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
    let newColor = e.target.value.replace(/　/g, ' ');// eslint-disable-line no-irregular-whitespace
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
    const rgbaObj = {
      r: Number(colorValue),
      g: this.color.value.green(),
      b: this.color.value.blue(),
      a: this.color.value.alpha()
    };
    const color = {
      format: this.color.format,
      value: rgbaObj
    };

    this.opts.oncolorchange(color);
  };

  /**
   * Green入力値のイベントリスナーハンドラー
   */
  this.handleInputRgbaGreenInput = value => {
    const colorValue = value || 0;
    const rgbaObj = {
      r: this.color.value.red(),
      g: colorValue,
      b: this.color.value.blue(),
      a: this.color.value.alpha()
    };

    const color = {
      format: this.color.format,
      value: rgbaObj
    };

    this.opts.oncolorchange(color);
  };

  /**
   * Blue入力値のイベントリスナーハンドラー
   */
  this.handleInputRgbaBlueInput = value => {
    const colorValue = value || 0;
    const rgbaObj = {
      r: this.color.value.red(),
      g: this.color.value.green(),
      b: colorValue,
      a: this.color.value.alpha()
    };

    const color = {
      format: this.color.format,
      value: rgbaObj
    };

    this.opts.oncolorchange(color);
  };

  /**
   * Alpha入力値のイベントリスナーハンドラー
   */
  this.handleInputAlphaInput = value => {
    const colorValue = value || 0;
    const rgbaObj = {
      r: this.color.value.red(),
      g: this.color.value.green(),
      b: this.color.value.blue(),
      a: new BigNumber(colorValue).div(100).toString() || 0
    };

    const color = {
      format: this.color.format,
      value: rgbaObj
    };

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
      style = concatenatePoundKey(this.color.value.hex());
      break;
    case COLOR_CODE.RGBA:
      style = `rgba(${this.color.value.red()},${this.color.value.green()},${this.color.value.blue()},${this.color.value.alpha()})`;
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
      param = this.color.value.red();
      break;
    case 'green':
      param = this.color.value.green();
      break;
    case 'blue':
      param = this.color.value.blue();
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
    let param = this.color.value.alpha();
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
   * @param {String} colorObj
   * @param {String} exportColorcode 
   * @return {String}
   */
  const convertColor = (colorObj, exportColorcode) => {
    switch(exportColorcode) {
    case COLOR_CODE.HEX:
      return colorObj.hex();
    case COLOR_CODE.RGBA: {
      const color = colorObj.object();
      color.a = colorObj.alpha();
      return color;
    }
    default:
      return null;
    }
  };
}