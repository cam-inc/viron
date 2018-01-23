const timeout = (ms = 100) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export default function() {
  const store = this.riotx.get();

  let autoHideTimerID;

  this.isVisible = false;

  const show = () => {
    Promise
      .resolve()
      .then(() => timeout())
      .then(() => {
        this.isVisible = true;
        this.update();
      });
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
