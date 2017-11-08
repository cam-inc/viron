import Quill from '../../../core/quill';

export default function() {
  /**
   * タップ領域がタップされた時の処理。
   */
  this.handleInnerClick = () => {
    this.opts.quill.focus();
    this.opts.quill.format('indent', '-1', Quill.sources.USER);
  };
}
