export default function() {
  const store = this.riotx.get();

  this.handleBlockerTap = e => {
    e.stopPropagation();
    if (!this.opts.ispreview) {
      return;
    }
    store.action('mediapreviews.add', {
      path: this.opts.val
    });
  };
}
