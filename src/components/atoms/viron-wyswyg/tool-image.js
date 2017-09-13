import hasOwn from 'mout/object/hasOwn';
import Quill from '../../../core/quill';

export default function() {
  // formatが適用中か否か。
  this.isActive = false;

  /**
   * formatボタン等のactive状態を更新します。
   * @param {Quill.Range} range
   */
  const updateActiveStatus = range => {
    const formats = (!range ? {} : this.opts.quill.getFormat(range));
    this.isActive = hasOwn(formats, 'image');
    this.update();
  };

  this.on('mount', () => {
    this.opts.quill.on(Quill.events.EDITOR_CHANGE, this.handleEditorChange);
    this.opts.quill.on(Quill.events.SCROLL_OPTIMIZE, this.handleScrollOptimize);
    const [range, ] = this.opts.quill.selection.getRange();
    updateActiveStatus(range);
  }).on('unmount', () => {
    this.opts.quill.off(Quill.events.EDITOR_CHANGE, this.handleEditorChange);
    this.opts.quill.off(Quill.events.SCROLL_OPTIMIZE, this.handleScrollOptimize);
  });

  /**
   * 文章もしくは選択範囲が変更された時の処理。
   * @see: https://quilljs.com/docs/api/#editor-change
   * @param {String} name "text-change" or "selection-change"
   * @param {Array} args
   */
  this.handleEditorChange = (name, ...args) => {
    const range = args[0];
    if (name == Quill.events.SELECTION_CHANGE) {
      updateActiveStatus(range);
    }
  };

  /**
   * スクロール最適化された時の処理。
   */
  this.handleScrollOptimize = () => {
    const [range, ] = this.opts.quill.selection.getRange();
    updateActiveStatus(range);
  };

  /**
   * タップ領域がタップされた時の処理。
   */
  this.handleInnerTap = () => {
    this.opts.quill.focus();
    // TODO: url入力フォームを表示
    this.opts.quill.format('image', 'https://dummyimage.com/600x400/000/fff', Quill.sources.USER);
  };
}
