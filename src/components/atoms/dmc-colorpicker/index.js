import BigNumber from 'bignumber.js';
import isNull from 'mout/lang/isNull';
import isUndefined from 'mout/lang/isUndefined';
import objectAssign from 'object-assign';
import tinycolor from 'tinycolor2';

const COLOR_CODE = {
  HEX: 'HEX',
  RGBA: 'RGBA',
  HSV: 'HSV'
};

export default function () {

  /*****************************************
   * 巻き上げによるエラー回避のためメソッドを上部に表記
   *****************************************/

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
   * HEXの値が正しくなるよう変更をかけます
   * @param {*} value 
   */
  const normalizeHexValue = value => {
    value = value.replace(/　/g, ' '); // eslint-disable-line no-irregular-whitespace

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

  /*****************************************
   * 値の初期化
   *****************************************/

  // カラーコード切り替えボタンのときの表示
  this.isColorChangeButtonActive = false;
  // キャッチャーアクティブ状態
  this.isCatcherActive = false;
  // 選択可能カラーコードが選択されていない場合、全種類のカラーコードを選択可能とする
  let selectableColorCode = this.opts.selectablecolorcode || {
    HEX: true,
    RGBA: true
  };
  // カラーデータを取得する
  this.color = this.opts.color || {
    format: COLOR_CODE.HEX,
    value: ''
  };
  // 選択可能カラーコードの中の当該カラーデータが有効になっていない場合それを選択可能にする
  if (!selectableColorCode[this.color.format]) {
    selectableColorCode[this.color.format] = true;
  }
  // 最後に色と認識された値を格納する
  let lastValidColor = '#000000';
  // canvasの初期化
  let canvas, context;
  // 最新の認められた色相値を保存
  let latestValidHue = 0;

  /*****************************************
   * Riotのライフサイクルイベント
   *****************************************/

  this.on('mount', () => {
    // canvasの初期化
    canvas = this.refs.canvas;
    context = canvas.getContext('2d');
    updateSpectrum();
  }).on('update', () => {
    selectableColorCode = this.opts.selectablecolorcode || {
      HEX: true,
      RGBA: true
    };
    this.color = this.opts.color || {
      format: COLOR_CODE.HEX,
      value: ''
    };
    // 正しい色であれば最新の正しい色として残す
    if (this.color.format === COLOR_CODE.HEX && isHex(this.color.value)) {
      lastValidColor = this.color.value;
    }
    updateSpectrum();
  }).on('updated', () => {
    if (this.color.format === COLOR_CODE.HEX && this.opts.isshown) {
      this.refs.inputHex.value = this.color.value;
    }
  });

  /*****************************************
   * メソッド群
   *****************************************/

  /**
   * カラーを変換します
   * @param {String} colorCode
   * @param {String} colorValue
   * @param {String} exportColorcode 
   * @return {Object}
   */
  const convertColor = (colorCode, colorValue, exportColorcode) => {
    let colorObj = {};

    if (colorCode === COLOR_CODE.HEX) {
      colorObj = (isHex(colorValue)) ? tinycolor(colorValue) : tinycolor(lastValidColor);
    } else {
      colorObj = tinycolor(colorValue);
    }

    if (exportColorcode === COLOR_CODE.HEX) {
      return colorObj.toHexString();
    }
    if (exportColorcode === COLOR_CODE.RGBA) {
      return colorObj.toRgb();
    }
    if (exportColorcode === COLOR_CODE.HSV) {
      return colorObj.toHsv();
    }
  };

  /**
   * タップした相対座標からHSVを算出します
   * @param {Integer} touchX 
   * @param {Integer} touchY 
   * @return {Object}
   */
  const getSpectrumColor = (touchX, touchY) => {
    // X: 彩度(Saturation) Y: 明度(Brightness)
    const containerRect = this.refs.canvasContainer.getBoundingClientRect();
    const distanceX = new BigNumber(touchX).minus(containerRect.left).toString();
    const distanceY = new BigNumber(touchY).minus(containerRect.top).toString();
    // HSVの取得
    const hue = convertColor(this.color.format, this.color.value, COLOR_CODE.HSV);
    const saturation = new BigNumber(distanceX).div(containerRect.width).round(2).times(100).toString();
    const brightness = new BigNumber(1).minus(new BigNumber(distanceY).div(containerRect.height).round(2)).times(100).toString();

    // モノクロであれば最新の色相に変更
    if (isMonochrome(this.color.format, this.color.value)) {
      hue.h = latestValidHue; 
    }

    const color = {
      h: hue.h,
      s: saturation,
      v: brightness
    };
    return color;
  };

  /**
   * 座標からカラーオブジェクトを返します
   * @param {integer} touchX 
   * @param {integer} touchY 
   */
  const getColorObject = (touchX, touchY) => {
    let hsv = getSpectrumColor(touchX, touchY);
    let colorValue = convertColor(COLOR_CODE.HSV, hsv, this.color.format);

    const color = {
      format: this.color.format,
      value: colorValue
    };

    return color;
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
   * スペクトラムのViewを更新する
   */
  const updateSpectrum = () => {
    // 色相の取得
    const hsv = convertColor(this.color.format, this.color.value, COLOR_CODE.HSV);
    if (isMonochrome(this.color.format, this.color.value)) {
      hsv.h = latestValidHue;
    } else {
      latestValidHue = hsv.h;
    }
    hsv.s = 100;
    hsv.v = 100;
    const hueHex = convertColor(COLOR_CODE.HSV, hsv, COLOR_CODE.HEX);
    // 横向きのグラデーション
    let linearGrad = context.createLinearGradient(0, 0, canvas.width, 0);
    linearGrad.addColorStop(0, 'rgb(255, 255, 255)');
    linearGrad.addColorStop(1, hueHex || '#FF0000');
    context.fillStyle = linearGrad;
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill();
    // 縦向きのグラデーション
    let linearGrad2 = context.createLinearGradient(0, 0, 0, canvas.height);
    linearGrad2.addColorStop(0, 'rgba(0, 0, 0, 0)');
    linearGrad2.addColorStop(1, 'rgb(0, 0, 0)');
    context.fillStyle = linearGrad2;
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill();
  };

  /**
   * 対象の色がモノクロか検査します
   * @param {String} format 
   * @param {Integer||String} value 
   */
  const isMonochrome = (format, value) => {
    let hsv = convertColor(format, value, COLOR_CODE.HSV);
    if (hsv.s === 0) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * スペクトラムのノブの位置を生成する
   * @param {String} hsvKind 'saturation' or 'brightness'
   */
  this.updateSpectrumKnob = hsvKind => {
    const hsv = convertColor(this.color.format, this.color.value, COLOR_CODE.HSV);
    objectAssign(hsv, {
      s: Math.round(hsv.s * 100) / 100,
      v: Math.round(hsv.v * 100) / 100
    });
    if (hsvKind === 'saturation') {
      return new BigNumber(hsv.s).times(100).round().toString();
    }
    
    if (hsvKind === 'brightness') {
      return new BigNumber(100).minus(new BigNumber(hsv.v).times(100)).round().toString();
    }
  };

  /**
   * 表示カラーコードを切り替えます。
   */
  this.handleColorChangeButtonTap = () => {
    const order = [COLOR_CODE.HEX, COLOR_CODE.RGBA];
    const color = {
      format: COLOR_CODE.HEX,
      value: ''
    };
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
   * dummyのinputの値を表示します。
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
   * 現在の色の色相を取得します。
   * @return {Integer}
   */
  this.getHueValue = () => {
    const hsv = convertColor(this.color.format, this.color.value, COLOR_CODE.HSV);
    if (isMonochrome(this.color.format, this.color.value)) {
      hsv.h = latestValidHue;
    }
    return Math.round(hsv.h);
  };

  /**
   * 現在の色のアルファ値を取得します。
   * @return {Integer}
   */
  this.getAlphaValue = () => {
    if (this.color.format === COLOR_CODE.RGBA) {
      return new BigNumber(this.color.value.a).times(100).toString();
    } else {
      return 100;
    }
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
    // 少数の値を純正の関数で計算すると正しい結果がでないため、ライブラリを使用する
    if (isNull(param)) {
      return 1;
    }
    return new BigNumber(param).times(100).round(2).toString();
  };

  /*****************************************
   * UIハンドラ
   *****************************************/

  /**
   * dummyinputのイベントリスナーハンドラー
   */
  this.handleInputTap = () => {
    this.opts.ontoggle(!this.opts.isshown);
  };

  /**
   * スペクトラムのイベントリスナーハンドラー
   * マウスダウンしたとき色を取得する
   * @param {eventObject} e
   */
  this.handleCanvasMouseDown = e => {
    this.isCatcherActive = true;
    const color = getColorObject(e.pageX, e.pageY);
    if (!isMonochrome(color.format, color.value)) {
      latestValidHue = convertColor(color.format, color.value, COLOR_CODE.HSV).h;
    }
    this.opts.oncolorchange(color);
  };

  /**
   * スペクトラムのイベントリスナーハンドラー
   * キャッチャーの中でマウスムーブしたとき色を取得する
   * @param {eventObject} e
   */
  this.handleCatcherMouseMove = e => {
    if (!this.isCatcherActive) {
      return;
    }
    const color = getColorObject(e.pageX, e.pageY);
    if (!isMonochrome(color.format, color.value)) {
      latestValidHue = convertColor(color.format, color.value, COLOR_CODE.HSV).h;
    }
    this.opts.oncolorchange(color);
  };

  /**
   * スペクトラムのイベントリスナーハンドラー
   * キャッチャーの中でマウスアップしたとき色を取得する
   * @param {eventObject} e
   */
  this.handleCatcherMouseUp = e => {
    this.isCatcherActive = false;
    const color = getColorObject(e.pageX, e.pageY);
    if (!isMonochrome(color.format, color.value)) {
      latestValidHue = convertColor(color.format, color.value, COLOR_CODE.HSV).h;
    }
    this.opts.oncolorchange(color);
  };

  /**
   * 色相スライダーのイベントリスナーハンドラー
   * スライダーを移動したとき色相値を取得する
   */
  this.handleHueSliderChange = (hue) => {
    const hsv = convertColor(this.color.format, this.color.value, COLOR_CODE.HSV);
    latestValidHue = hue;
    hsv.h = hue;
    const colorValue = convertColor(COLOR_CODE.HSV, hsv, this.color.format);
    const color = {
      format: this.color.format,
      value: colorValue
    };
    this.opts.oncolorchange(color);
  };

  /**
   * 透明度スライダーのイベントリスナーハンドラー
   * スライダーを移動したとき透明度を取得する
   */
  this.handleAlphaSliderChange = (alpha) => {
    const color = this.color;
    if (this.color.format !== COLOR_CODE.RGBA) {
      color.format = COLOR_CODE.RGBA;
      color.value = convertColor(this.color.format, this.color.value, COLOR_CODE.RGBA);
    }
    color.value.a = new BigNumber(alpha).div(100).toString();
    this.opts.oncolorchange(color);
  };

  /**
   * HEX入力値のイベントリスナーハンドラー
   */
  this.handleInputHexInput = e => {
    let newColor = e.target.value; // eslint-disable-line no-irregular-whitespace
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
    objectAssign(color.value, {
      r: colorValue
    });

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
    objectAssign(color.value, {
      g: colorValue
    });

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
    objectAssign(color.value, {
      b: colorValue
    });

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
    objectAssign(color.value, {
      a: new BigNumber(colorValue).div(100).toString() || 0
    });

    this.opts.oncolorchange(color);
  };

  /**
   * 色切り替えボタンのイベントリスナーハンドラー
   * タップしたとき背景色を変更する
   */
  this.handleColorChangeButtonTouchStart = () => {
    this.isColorChangeButtonActive = true;
  };

  /**
   * 色切り替えボタンのイベントリスナーハンドラー
   * タップした指を離したとき背景色を戻す
   */
  this.handleColorChangeButtonTouchEnd = () => {
    this.isColorChangeButtonActive = false;
  };

  /**
   * 色切り替えボタンのイベントリスナーハンドラー
   * マウスオーバーしたとき背景色を変更する
   */
  this.handleColorChangeButtonMouseOver = () => {
    this.isColorChangeButtonActive = true;
  };

  /**
   * 色切り替えボタンのイベントリスナーハンドラー
   * マウスアウトしたとき背景色を変更する
   */
  this.handleColorChangeButtonMouseOut = () => {
    this.isColorChangeButtonActive = false;
  };
}
