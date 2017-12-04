export default function() {
  const store = this.riotx.get();

  let autoHideTimerID;

  this.isVisible = false;

  const show = () => {
    // need to set delay after dom mountation.
    setTimeout(() => {
      this.isVisible = true;
      this.update();
    }, 100);
  };

  const hide = () => {
    this.isVisible = false;
    this.update();
    // call action after the hide animation completes.
    setTimeout(() => {
      store.action('toasts.remove', this.opts.id);
    }, 1000);
  };

  this.on('mount', () => {
    show();
    if (this.opts.autohide) {
      autoHideTimerID = setTimeout(() => {
        hide();
      }, this.opts.timeout);
    }
  }).on('unmount', () => {
    clearTimeout(autoHideTimerID);
  });

  this.handleTap = () => {
    clearTimeout(autoHideTimerID);
    hide();
  };
}
