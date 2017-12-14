export default function() {
  const store = this.riotx.get();

  this.path = this.opts.tagopts.path;

  const fadeIn = () => {
    setTimeout(() => {
      this.isVisible = true;
      this.update();
    }, 100);
  };

  const fadeOut = () => {
    this.isVisible = false;
    this.update();
    setTimeout(() => {
      store.action('mediapreviews.remove', this.opts.id);
    }, 1000);
  };

  this.on('mount', () => {
    fadeIn();
    window.addEventListener('keydown', this.handleKeyDown);
  }).on('unmount', () => {
    window.removeEventListener('keydown', this.handleKeyDown);
  });

  this.handleTap = () => {
    fadeOut();
  };

  this.handleFrameTap = e => {
    // 内部イベントを外部に伝播させない。
    e.stopPropagation();
  };

  this.handleCloseButtonTap = () => {
    fadeOut();
  };

  this.handleKeyDown = e => {
    switch (e.keyCode) {
    case 27: // Esc
      fadeOut();
      break;
    default:
      break;
    }
  };
}
