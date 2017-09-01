import BigNumber from 'bignumber.js';
import isNull from 'mout/lang/isNull';
import isString from 'mout/lang/isString';
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
    if (!isString(value)) {
      return false;
    }
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
      colorObj = (isHex(colorValue)) ? tinycolor(colorValue) : tinycolor(lastValidColor);
    } else if(colorCode === COLOR_CODE.HSV) {
      colorObj = tinycolor(`hsv(${colorValue.h}, ${colorValue.s}%, ${colorValue.v}%)`);
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
   * スペクトラムのViewを更新する
   */
  const updateSpectrum = () => {
    const canvas = this.refs.canvas;
    if (!canvas) {
      return;
    }

    if (!this.opts.isshown) {
      return;
    }

    context = context || this.refs.canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    // 色相の取得
    let hsv = this.getHsv();
    hsv.s = 100;
    hsv.v = 100;
    const hueHex = convertColor(COLOR_CODE.HSV, hsv, COLOR_CODE.HEX);
    // 横向きのグラデーション
    let linearGrad = context.createLinearGradient(0, 0, canvas.width, 0);
    linearGrad.addColorStop(0, 'rgb(255, 255, 255)');
    linearGrad.addColorStop(1, hueHex);
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

  /*****************************************
   * 値の初期化
   *****************************************/

  // カラーコード切り替えボタンのときの表示
  this.isColorChangeButtonActive = false;
  // 選択可能カラーコードが選択されていない場合、全種類のカラーコードを選択可能とする
  let selectableColorCode = this.opts.selectablecolorcode || {
    HEX: true,
    RGBA: true
  };

  // カラーデータを取得する
  this.color = (this.opts.color) ? objectAssign({}, this.opts.color) : {format: COLOR_CODE.HEX, value: ''};

  // HEXのとき、Undefinedであれば黒を入れる
  if (isUndefined(this.opts.color.value) && this.color.format === COLOR_CODE.HEX) {
    this.color.value = '#000000';
  }

  // 選択可能カラーコードの中の当該カラーデータが有効になっていない場合それを選択可能にする
  if (!selectableColorCode[this.color.format]) {
    selectableColorCode[this.color.format] = true;
  }
  // 最後に色と認識された値を格納する
  let lastValidColor = '#000000';
  // canvasの初期化
  let context;

  /*****************************************
   * Riotのライフサイクルイベント
   *****************************************/

  this.on('mount', () => {
    updateSpectrum();
  }).on('update', () => {
    selectableColorCode = this.opts.selectablecolorcode || {
      HEX: true,
      RGBA: true
    };
    this.color = (this.opts.color) ? objectAssign({}, this.opts.color) : {format: COLOR_CODE.HEX,value: ''};
    if (isUndefined(this.opts.color.value) && this.color.format === COLOR_CODE.HEX) {
      this.color.value = '#000000';
    }
    // 正しい色であれば最新の正しい色として残す
    if (this.color.format === COLOR_CODE.HEX && isHex(this.color.value)) {
      lastValidColor = this.color.value;
    }
  }).on('updated', () => {
    this.rebindTouchEvents();
    if (this.opts.isshown) {
      context = context || this.refs.canvas.getContext('2d');
    } else {
      context = null;
    }
    updateSpectrum();
    if (this.color.format === COLOR_CODE.HEX && this.opts.isshown) {
      this.refs.inputHex.value = this.color.value;
    }
  });

  /*****************************************
   * メソッド群
   *****************************************/

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
   * 座標からカラーオブジェクトを返します
   * @param {integer} touchX 
   * @param {integer} touchY 
   */
  const getColorObject = (touchX, touchY) => {
    // X: 彩度(Saturation) Y: 明度(Brightness)
    const containerRect = this.refs.canvasContainer.getBoundingClientRect();
    let x = Math.round(touchX - containerRect.left);
    let y = Math.round(touchY - containerRect.top);

    if (x > containerRect.width) {
      x = containerRect.width;
    }
    if (x < 0) {
      x = 0;
    }
    if (y > containerRect.height) {
      y = containerRect.height;
    }
    if (y < 0) {
      y = .1;
    }

    const hue = this.getHsv().h;
    let saturation = Math.round(x / containerRect.width * 100);
    let brightness = 100 - Math.round(y / containerRect.height * 100);

    const color = {
      h: hue,
      s: saturation,
      v: brightness
    };

    return color;
  };

  /**
   * HSVに変換し四捨五入したものを返します。
   */
  this.getHsv = () => {
    let hsv;
    if (this.opts.hsv) {
      hsv = objectAssign({}, this.opts.hsv);
    } else {
      hsv = convertColor(this.color.format, this.color.value, COLOR_CODE.HSV);
      objectAssign(hsv, {
        h: Math.round(hsv.h),
        s: (Math.round(hsv.s * 100) / 100) * 100,
        v: (Math.round(hsv.v * 100) / 100) * 100
      });
    }

    return hsv;
  };

  /**
   * スペクトラムのノブの位置を生成する
   * @param {String} saturation or brightness
   */
  this.getSpectrumPosition = param => {
    let hsv = this.getHsv();
    if (param === 'saturation') {
      let saturation = hsv.s;
      if (saturation > 100) {
        saturation = 100;
      }
      if (saturation < 0) {
        saturation = 0;
      }
      return saturation;
    }
    if (param === 'brightness') {
      let brightness = 100 - hsv.v;
      if (brightness > 100) {
        brightness = 100;
      }
      if (brightness < 0) {
        brightness = 0;
      }
      return brightness;
    }
  };

  /**
   * 現在の色のアルファ値を取得します。
   * @return {Integer}
   */
  this.getAlphaValue = () => {
    if (this.color.format === COLOR_CODE.RGBA) {
      if (isUndefined(this.color.value)) {
        return 100;
      }
      return new BigNumber(this.color.value.a).times(100).toNumber();
    } else {
      return 100;
    }
  };

  /**
   * 表示用のカラースタイルを返却します。
   * @return {String}
   */
  this.getColorStyle = () => {
    let style = '';
    if (this.color.format === COLOR_CODE.HEX) {
      style = (isHex(this.color.value)) ? concatenatePoundKey(this.color.value) : lastValidColor;
    }
    if (this.color.format === COLOR_CODE.RGBA) {
      if (isUndefined(this.color.value)) {
        style = 'rgba(0,0,0,1)';
      } else {
        style = `rgba(${this.color.value.r},${this.color.value.g},${this.color.value.b},${this.color.value.a})`;
      }
    }

    return style;
  };

  /**
   * readonlyのinputの値を表示します。
   */
  this.getDummyValue = () => {
    let style = '';
    if (isUndefined(this.opts.color.value)) {
      return 'undefined';
    }
    if (this.color.format === COLOR_CODE.HEX) {
      style = concatenatePoundKey(this.color.value);
    }
    if (this.color.format === COLOR_CODE.RGBA) {
      style = `${this.color.value.r},${this.color.value.g},${this.color.value.b},${this.color.value.a}`;
    }

    return style;
  };

  this.getHexValue = () => {
    if (isUndefined(this.opts.color.value)) {
      return '#000000';
    }
    return this.color.value;
  };

  /**
   * 表示用のRGB値を返却します。
   * @return {Integer}
   */
  this.getRgbaValue = primaryColor => {
    let param = null;
    if (isUndefined(this.color.value)) {
      return 0;
    }
    if (primaryColor === 'red') {
      param = this.color.value.r;
    }
    if (primaryColor === 'green') {
      param = this.color.value.g;
    }
    if (primaryColor === 'blue') {
      param = this.color.value.b;
    }

    if (isNull(param)) {
      return '';
    }
    return param;
  };

  /*****************************************
   * UIハンドラ
   *****************************************/

  /**
   * 表示カラーコードを切り替える
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
   * スペクトラムのイベントリスナーハンドラー
   * マウスダウンしたとき色を取得する
   * @param {eventObject} e
   */
  this.handleCanvasMouseDown = e => {
    this.isCatcherActive = true;

    const hsv = getColorObject(e.pageX, e.pageY);
    const color = {
      format: this.color.format,
      value: convertColor(COLOR_CODE.HSV, hsv, this.color.format)
    };
    this.opts.oncolorchange(color, hsv);
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

    const hsv = getColorObject(e.pageX, e.pageY);
    const color = {
      format: this.color.format,
      value: convertColor(COLOR_CODE.HSV, hsv, this.color.format)
    };
    this.opts.oncolorchange(color, hsv);
  };

  /**
   * スペクトラムのイベントリスナーハンドラー
   * キャッチャーの中でマウスアップしたとき色を取得する
   * @param {eventObject} e
   */
  this.handleCatcherMouseUp = e => {
    this.isCatcherActive = false;

    const hsv = getColorObject(e.pageX, e.pageY);
    const color = {
      format: this.color.format,
      value: convertColor(COLOR_CODE.HSV, hsv, this.color.format)
    };
    this.opts.oncolorchange(color, hsv);
  };

  /**
   * スペクトラムのイベントリスナーハンドラー
   * タッチしたとき色を取得する
   * @param {eventObject} e
   */
  this.handleCanvasTouchStart = e => {
    this.isCatcherActive = true;
    
    const hsv = getColorObject(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    const color = {
      format: this.color.format,
      value: convertColor(COLOR_CODE.HSV, hsv, this.color.format)
    };
    this.opts.oncolorchange(color, hsv);
  };

  /**
   * スペクトラムのイベントリスナーハンドラー
   * キャッチャーの中でタッチムーブしたとき色を取得する
   * @param {eventObject} e
   */
  this.handleCatcherTouchMove = e => {
    if (!this.isCatcherActive) {
      return;
    }

    const hsv = getColorObject(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    const color = {
      format: this.color.format,
      value: convertColor(COLOR_CODE.HSV, hsv, this.color.format)
    };
    this.opts.oncolorchange(color, hsv);
  };

  /**
   * スペクトラムのイベントリスナーハンドラー
   * キャッチャーの中でタッチエンドしたとき色を取得する
   * @param {eventObject} e
   */
  this.handleCatcherTouchEnd = e => {
    this.isCatcherActive = false;

    const hsv = getColorObject(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    const color = {
      format: this.color.format,
      value: convertColor(COLOR_CODE.HSV, hsv, this.color.format)
    };
    this.opts.oncolorchange(color, hsv);
  };

  /**
   * 色相スライダーのイベントリスナーハンドラー
   * スライダーを移動したとき色相値を取得する
   */
  this.handleHueSliderChange = (hue) => {
    const hsv = convertColor(this.color.format, this.color.value, COLOR_CODE.HSV);
    hsv.h = hue;
    hsv.s = Math.round(hsv.s * 100);
    hsv.v = Math.round(hsv.v * 100);
    const colorValue = convertColor(COLOR_CODE.HSV, hsv, this.color.format);

    const color = {
      format: this.color.format,
      value: colorValue
    };
    this.opts.oncolorchange(color, hsv);
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
    color.value.a = alpha / 100;
    this.opts.oncolorchange(color, this.opts.hsv);
  };

  /**
   * HEX入力値のイベントリスナーハンドラー
   */
  this.handleInputHexInput = e => {
    let newColor = e.target.value;
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
      value: this.color.value || {r: 0, g: 0, b: 0, a: 1}
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
      value: this.color.value || {r: 0, g: 0, b: 0, a: 1}
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
      value: this.color.value || {r: 0, g: 0, b: 0, a: 1}
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
      value: this.color.value || {r: 0, g: 0, b: 0, a: 1}
    };
    objectAssign(color.value, {
      a: new BigNumber(colorValue).div(100).toString() || 0
    });

    this.opts.oncolorchange(color);
  };

  /**
   * dummyinputのイベントリスナーハンドラー
   */
  this.handleInputTap = () => {
    this.opts.ontoggle(!this.opts.isshown);
  };
}
