export default function() {
  const store = this.riotx.get();
  const mimeType = this.opts.mimetype || '';

  this.isImage = false;

  // MIME-typeで表示を切り替える。
  // @see: https://ja.wikipedia.org/wiki/Multipurpose_Internet_Mail_Extensions
  if (mimeType.indexOf('image') === 0) {
    this.isImage = true;
  }

  this.handleBlockerTap = e => {
    e.stopPropagation();
    if (!this.opts.ispreview) {
      return;
    }
    store.action('mediapreviews.add', {
      path: `data:${this.mimeType};base64,${this.opts.val}`
    });

  };
}
