export default function() {
  // 表示状態
  this.isVisible = false;

  this.on('mount', () => {
    setTimeout(() => {
      if (!this.isMounted) {
        return;
      }
      this.isVisible = true;
      this.update();
    }, 100);
  });
}
