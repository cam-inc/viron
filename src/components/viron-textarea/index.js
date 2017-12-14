import clipboard from 'clipboard-js';
import isString from 'mout/lang/isString';

export default function() {
  const store = this.riotx.get();

  // クリップっボードコピーをサポートしているか否か。
  let isClipboardCopySupported = true;
  // モバイル用レイアウトか否か。
  this.isMobile = store.getter('layout.isMobile');

  /**
   * 文字列もしくはnullに変換します。
   * @param {String|null|undefined} value
   * @return {String|null}
   */
  this.normalizeValue = value => {
    if (!isString(value)) {
      return null;
    }
    return value;
  };

  this.handleTap = () => {
    if (this.opts.isdisabled) {
      return;
    }
    this.refs.input.focus();
  };

  this.handleFormSubmit = e => {
    e.preventDefault();
    if (!this.opts.onchange) {
      return;
    }
    if (this.opts.isdisabled) {
      return;
    }
    const newVal = this.normalizeValue(this.opts.val);
    this.opts.onchange(newVal, this.opts.id);
  };

  // `blur`時にも`change`イベントが発火する。
  // 不都合な挙動なのでイベント伝播を止める。
  this.handleTextareaChange = e => {
    e.stopPropagation();
  };

  this.handleTextareaInput = e => {
    if (!this.opts.onchange) {
      return;
    }
    if (this.opts.isdisabled) {
      return;
    }
    const newVal = this.normalizeValue(e.target.value);
    this.opts.onchange(newVal, this.opts.id);
  };

  this.handleTextareaFocus = () => {
    if (!this.opts.onfocus) {
      return;
    }
    this.opts.onfocus();
  };

  this.handleTextareaBlur = () => {
    if (!this.opts.onblur) {
      return;
    }
    this.opts.onblur();
  };

  this.handleBlockerTap = e => {
    e.stopPropagation();
    if (this.isMobile || !isClipboardCopySupported || !this.opts.val) {
      return;
    }
    Promise
      .resolve()
      .then(() => {
        return clipboard.copy(this.opts.val);
      })
      .then(() => store.action('toasts.add', {
        message: 'クリップボードへコピーしました。'
      }))
      .catch(() => {
        isClipboardCopySupported = false;
        store.action('toasts.add', {
          type: 'error',
          message: 'ご使用中のブラウザではクリップボードへコピー出来ませんでした。'
        });
      });
  };
}
