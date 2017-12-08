export default function() {
  // 表示状態
  this.isVisible = false;

  this.on('mount', () => {
    // プレビューモードでは何も表示しない。
    if (this.opts.ispreview) {
      return;
    }
    setTimeout(() => {
      if (!this.isMounted) {
        return;
      }
      this.isVisible = true;
      this.update();
    }, 100);
  });
}
