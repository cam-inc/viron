export default function() {
  this.isAnimating = this.opts.isactive;

  this.on('update', () => {
    if (this.opts.isactive) {
      this.isAnimating = true;
    } else if (this.isAnimating) {
      setTimeout(() => {
        this.isAnimating = false;
        this.update();
      }, 300);
    }
  });
}
