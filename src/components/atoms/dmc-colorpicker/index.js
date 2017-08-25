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

  /**
   * 値がRGBAか判定します。
   * @param {String} value 
   * @return {Boolean}
   */
  const isRgba = value => {
    const isMatch = value.match(/^(\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-1](?:\.\d+)?))$/);
    return isMatch;
  };

  // カラーコード切り替えボタンのときの表示
  this.isColorChangeButtonActive = false;
  // 選択可能カラーコードが選択されていない場合、全種類のカラーコードを選択可能とする
  let selectableColorCode = this.opts.selectablecolorcode || { HEX: true, RGBA: true };
  // カラーデータを取得する。親から取得できない場合、空を代入する。
  this.color = this.opts.color || {format: selectableColorCode[COLOR_CODE.HEX], value: ''};
  // もし選択可能カラーコードの中の当該カラーデータがtrueになっていなかったら、それを選択可能にする
  if (!selectableColorCode[this.color.format]) {
    selectableColorCode[this.color.format] = true;
  }
  // フォーマットが合っていない場合、空文字にする
  if(this.color.format === COLOR_CODE.HEX) {
    if (this.color.value !== '' && !isHex(this.color.value)) {
      this.color.value = '';
    } 
  }
  if(this.color.format === COLOR_CODE.RGBA) {
    if (this.color.value !== '' && !isRgba(this.color.value)) {
      this.color.value = '';
    } 
  }

  this.on('update', () => {
    selectableColorCode = this.opts.selectablecolorcode || {HEX: true, RGBA: true};
    this.color = this.opts.color || {format: selectableColorCode[COLOR_CODE.HEX], value: ''};
  }).on('updated', () => {
    if (this.color.format === COLOR_CODE.HEX && this.opts.isshown) {
      this.refs.inputHex.value = this.color.value;
    }
  });

  /**
   * 表示カラーコードを切り替える
   */
  this.handleColorChangeButtonTap = () => {
    const color = {
      format: COLOR_CODE.HEX,
      value: ''
    };

    // HEX -> RGBAへ変換する
    if (this.color.format === COLOR_CODE.HEX) {
      if (selectableColorCode[COLOR_CODE.RGBA]) {
        color.format = COLOR_CODE.RGBA;
        color.value = convertColor(COLOR_CODE.HEX, this.color.value, COLOR_CODE.RGBA);
      } else {
        color.format = COLOR_CODE.HEX;
        color.value = this.color.value;
      }
    }

    // RGBA -> HEXへ変換する
    if (this.color.format === COLOR_CODE.RGBA) {
      if (selectableColorCode[COLOR_CODE.HEX]) {
        color.format = COLOR_CODE.HEX;
        color.value = convertColor(COLOR_CODE.RGBA, this.color.value, COLOR_CODE.HEX);
      } else {
        color.format = COLOR_CODE.RGBA;
        color.value = this.color.value;
      }
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
    const rgbaArray = this.opts.color.value.split(',');
    const colorValue = value || 0;
    rgbaArray[0] = colorValue;

    const color = {
      format: this.color.format,
      value: rgbaArray.join(',')
    };

    this.opts.oncolorchange(color);
  };

  /**
   * Green入力値のイベントリスナーハンドラー
   */
  this.handleInputRgbaGreenInput = value => {
    const rgbaArray = this.opts.color.value.split(',');
    const colorValue = value || 0;
    rgbaArray[1] = colorValue;

    const color = {
      format: this.color.format,
      value: rgbaArray.join(',')
    };

    this.opts.oncolorchange(color);
  };

  /**
   * Blue入力値のイベントリスナーハンドラー
   */
  this.handleInputRgbaBlueInput = value => {
    const rgbaArray = this.opts.color.value.split(',');
    const colorValue = value || 0;
    rgbaArray[2] = colorValue;

    const color = {
      format: this.color.format,
      value: rgbaArray.join(',')
    };

    this.opts.oncolorchange(color);
  };

  /**
   * Alpha入力値のイベントリスナーハンドラー
   */
  this.handleInputAlphaInput = value => {
    const rgbaArray = this.opts.color.value.split(',');
    value = new BigNumber(value).div(100).toString() || 0;
    rgbaArray[3] = value;

    const color = {
      format: this.color.format,
      value: rgbaArray.join(',')
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
      style = concatenatePoundKey(this.color.value);
      break;
    case COLOR_CODE.RGBA:
      style = `rgba(${this.color.value})`;
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
    let paramArray = this.color.value.split(',');
    let param = null;
    switch (primaryColor) {
    case 'red':
      param = paramArray[0];
      break;
    case 'green':
      param = paramArray[1];
      break;
    case 'blue':
      param = paramArray[2];
      break;
    default:
      break;
    }

    if (isNull(param)) {
      return '';
    }
    // NaNは0として扱う。
    // if (isNaN(param)) {
    //   return 0;
    // }
    return param;
  };

  /**
   * 表示用のAlpha値を返却します。
   * @return {String}
   */
  this.generateAlphaValue = () => {
    let param = this.color.value.split(',')[3];
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
   * @param {String} beforeColorcode
   * @param {String} beforeColorValue
   * @param {String} exportColorcode 
   * @return {String}
   */
  const convertColor = (beforeColorcode, beforeColorValue, exportColorcode) => {
    let color = null;
    switch (beforeColorcode) {
    case COLOR_CODE.HEX:
      color = Color(beforeColorValue);
      break;
    case COLOR_CODE.RGBA: {
      let colorArray = beforeColorValue.split(',');
      color = Color([
        Number(colorArray[0]),
        Number(colorArray[1]),
        Number(colorArray[2]),
      ]).alpha(colorArray[3]);
      break;
    }
    default:
      break;
    }

    switch(exportColorcode) {
    case COLOR_CODE.HEX:
      return color.hex();
    case COLOR_CODE.RGBA:
      return `${color.red()},${color.green()},${color.blue()},${color.alpha()}`;
    default:
      return null;
    }
  };
}