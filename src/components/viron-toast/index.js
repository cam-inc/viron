export default function() {
  const store = this.riotx.get();

  let autoHideTimerID;

  const show = () => {
    // need to set delay after dom mountation.
    setTimeout(() => {
      this.root.classList.add('Toast--visible');
    }, 100);
  };

  const hide = () => {
    this.root.classList.remove('Toast--visible');
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

  this.handleLinkTap = () => {
    window.open(this.opts.link);
  };
}
