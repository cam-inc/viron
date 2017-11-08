export default function() {
  /**
   * 全体がタップされた時の処理。
   */
  this.handleClick = () => {
    this.opts.onclick();
  };
}
