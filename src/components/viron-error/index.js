export default function() {
  // タイトル。
  this.title = this.opts.title;
  // メッセージ。
  this.message = this.opts.message;
  // errorが渡された場合は最適化処理を行う。
  if (!!this.opts.error) {
    this.title = this.title || this.opts.error.name || this.opts.error.statusText || 'Error';
    this.message = this.message || this.opts.error.message;
  }

  // prettyprintで表示させる内容。
  this.detail = null;

  this.on('mount', () => {
    // エラーがPromiseであれば解析する。
    const error = this.opts.error;
    if (!error) {
      return;
    }
    if (error instanceof Error) {
      return;
    }
    Promise
      .resolve()
      .then(() => {
        if (!!error.json) {
          return error.json();
        }
        return error.text().then(text => JSON.parse(text));
      })
      .then(json => {
        const error = json.error;
        this.detail = error;
        !this.opts.title && !!error.name && (this.title = error.name);
        !this.opts.message && !!error.data && !!error.data.message && (this.message = error.data.message);
        this.update();
      })
      .catch(() => {
        // do nothing on purpose.
        return Promise.resolve();
      });
  });
}
