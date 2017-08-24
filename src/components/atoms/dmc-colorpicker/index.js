import BigNumber from 'bignumber.js';
import Color from 'color';
import isNull from 'mout/lang/isNull';
import isUndefined from 'mout/lang/isUndefined';

const COLOR_CODE = {
  HEX: 'HEX',
  RGBA: 'RGBA'
};

export default function() {
  // カラーコード切り替えボタンのときの表示
  this.isColorChangeButtonActive = false;
  // 選択可能カラーコードが選択されていない場合、全種類のカラーコードを選択可能とする
  this.selectableColorCode = (!isUndefined(this.opts.selectablecolorCode)) ? this.opts.selectablecolorCode : {HEX: true, RGBA: true};
  // カラーデータを取得する。親から取得できない場合、空を代入する。
  this.color = (!isUndefined(this.opts.color)) ? this.opts.color : {format: this.selectableColorCode[COLOR_CODE.HEX], value: ''};

  this.on('update', () => {
    this.selectableColorCode = (!isUndefined(this.opts.selectablecolorCode)) ? this.opts.selectablecolorCode : {HEX: true, RGBA: true};
    this.color = (!isUndefined(this.opts.color)) ? this.opts.color : {format: this.selectableColorCode[COLOR_CODE.HEX], value: ''};
  }).on('updated', () => {
    if (this.color.format === COLOR_CODE.HEX) {
      if (this.opts.isshown) {
        this.refs.inputHex.value = this.color.value;
      }
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
      if (this.selectableColorCode[COLOR_CODE.RGBA]) {
        color.format = COLOR_CODE.RGBA;
        color.value = convertColor(COLOR_CODE.HEX, this.color.value, COLOR_CODE.RGBA);
      } else {
        color.value = this.color.value;
      }
    }

    // RGBA -> HEXへ変換する
    if (this.color.format === COLOR_CODE.RGBA) {
      if (this.selectableColorCode[COLOR_CODE.HEX]) {
        color.format = COLOR_CODE.HEX;
        color.value = convertColor(COLOR_CODE.RGBA, this.color.value, COLOR_CODE.HEX);
      } else {
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

  this.handleInputRgbaRedInput = value => {
    const rgbaArray = this.opts.color.value.split(',');
    rgbaArray[0] = value;

    const color = {
      format: this.color.format,
      value: rgbaArray.join(',')
    };

    this.opts.oncolorchange(color);
  };

  this.handleInputRgbaGreenInput = value => {
    const rgbaArray = this.opts.color.value.split(',');
    rgbaArray[1] = value;

    const color = {
      format: this.color.format,
      value: rgbaArray.join(',')
    };

    this.opts.oncolorchange(color);
  };

  this.handleInputRgbaBlueInput = value => {
    const rgbaArray = this.opts.color.value.split(',');
    rgbaArray[2] = value;

    const color = {
      format: this.color.format,
      value: rgbaArray.join(',')
    };

    this.opts.oncolorchange(color);
  };

  this.handleInputAlphaInput = value => {
    const rgbaArray = this.opts.color.value.split(',');
    rgbaArray[3] = new BigNumber(value).div(100).toString();

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
      style = concatenateSharp(this.color.value);
      break;
    case COLOR_CODE.RGBA:
      style = `rgba(${this.color.value})`;
      break;
    default:
      break;
    }

    return style;
  };

  this.generateAlphaValue = () => {
    return new BigNumber(this.color.value.split(',')[3]).times(100).round(2).toString();
  };

  const normalizeHexValue = value => {
    if (isNull(value)) {
      return value;
    }

    if (isUndefined(value)) {
      return null;
    }
    
    // 正しいフォーマットだがシャープをつけていない場合、頭にシャープをつける
    if (isHex(value)) {
      value = concatenateSharp(value);
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
    return (!isNull(isMatch)) ? true : false;
  };

  /**
   * 値がHEXか判定します。
   * シャープはついていてもいなくてもtrueを返します。
   * @param {String} value 
   * @return {Boolean}
   */
  const isHex = value => {
    const isMatch = value.match(/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/);
    return (!isNull(isMatch)) ? true : false;
  };

  /**
   * シャープがついていない場合、シャープを頭につける。
   * @param {String} value 
   * @return {String}
   */
  const concatenateSharp = value => {
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