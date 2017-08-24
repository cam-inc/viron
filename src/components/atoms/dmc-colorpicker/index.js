import Color from 'color';
import isNull from 'mout/lang/isNull';
import isUndefined from 'mout/lang/isUndefined';

export default function() {
  // カラーコード切り替えボタンのときの表示
  this.isColorChangeButtonActive = false;
  // 選択可能カラーコードが選択されていない場合、全種類のカラーコードを選択可能とする
  this.selectableColorcode = (!isUndefined(this.opts.selectablecolorcode)) ? this.opts.selectablecolorcode : ['HEX', 'RGBA', 'CMYK'];
  // 
  this.color = (!isUndefined(this.opts.color)) ? this.opts.color : {format: this.selectableColorcode[0], value: ''};
  // 表示用のカラーコードを取得する
  // 取得できない場合、選択可能カラーコードの一番目を取得する
  this.displayColorcode = this.opts.displaycolorcode || this.selectableColorcode[0];

  this.on('update', () => {
    this.selectableColorcode = (!isUndefined(this.opts.selectablecolorcode)) ? this.opts.selectablecolorcode : ['HEX', 'RGBA', 'CMYK'];
    this.color = (!isUndefined(this.opts.color)) ? this.opts.color : {format: this.selectableColorcode[0], value: ''};
    this.displayColorcode = this.opts.displaycolorcode || this.selectableColorcode[0];
  }).on('updated', () => {
    if (this.displayColorcode === 'HEX') {
      this.refs.inputSingle.value = this.color.value;
    }
  });

  /**
   * 表示カラーコードを切り替える
   */
  this.handleColorChangeButtonTap = () => {
    // セレクタブルから現在のカラーコードを取得
    let index = this.selectableColorcode.indexOf(this.displayColorcode);
    if (index !== -1) {
      // ある場合、次の順番のカラーコードを取得
      // 添字が一番うしろの場合は０に戻る
      index = (this.selectableColorcode.length === index) ? 0 : index+1;
    } else {
      index = 0;
    }

    this.opts.ondisplaychange(this.selectableColorcode[index]);
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

  this.handleInputSingleInput = e => {
    let newColor = e.target.value.replace(/　/g, ' ');// eslint-disable-line no-irregular-whitespace
    // 正しいフォーマットだがシャープをつけていない場合、頭にシャープをつける
    if (validHex(newColor)) {
      newColor = concatenateSharp(newColor);
    }

    // HEXでなければ変更前の文字列に戻す
    if (!validTypingHex(newColor)) {
      newColor = this.opts.color.value;
    }

    const color = {
      format: this.displayColorcode,
      value: newColor
    };
    
    this.opts.oncolorchange(color);
    this.opts.ondisplaychange(color.format);
  };

  /**
   * 表示用のカラースタイルを返却します。
   * @return {String}
   */
  this.generateColorStyle = () => {
    let style = '';
    switch (this.displayColorcode) {
    case 'HEX':
      style = concatenateSharp(this.color.value);
      break;
    
    default:
      break;
    }

    return style;
  };

  /**
   * 値がHEXか判定します。
   * 入力用なため、16進数を3,6文字に限定するのではなく
   * 1~6文字以内で許容します。
   * @param {String} value 
   * @return {Boolean}
   */
  const validTypingHex = value => {
    const isMatch = value.match(/^#?[0-9A-Fa-f]{0,6}$/);
    return (!isNull(isMatch)) ? true : false;
  };

  /**
   * 値がHEXか判定します。
   * シャープはついていてもいなくてもtrueを返します。
   * @param {String} value 
   * @return {Boolean}
   */
  const validHex = value => {
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
   * 対象のカラーフォーマットに基づいてカラーを返却します
   * @param {Object} beforeColor 
   * @param {String} exportFormat 
   */
  const convertColor = (beforeColor, exportFormat) => {
    let color = null;
    switch (beforeColor.format) {
    case 'HEX':
      color = Color(beforeColor.value);
      break;
    case 'RGBA':
      color = Color(`rgba(${beforeColor.value})`);
      break;
    case 'CMYK':
      color = Color(`cmyk(${beforeColor.value})`);
      break;
    default:
      break;
    }

    if (!isNull(color)) {
      switch (exportFormat) {
      case 'HEX':
        return color.hex().string();
      case 'RGBA':
        return color.rgba().array().join(',');
      case 'CMYK':
        return color.cmyk().array().join(',');
      default:
        break;
      }
    }
  }; 
}