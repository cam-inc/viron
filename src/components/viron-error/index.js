export default function() {
  // タイトル。
  this.title = this.opts.title;
  // メッセージ。
  this.message = this.opts.message;
  // prettyprintで表示させる内容。
  this.detail = null;
  // errorが渡された場合は最適化処理を行う。
  const error = this.opts.error;
  if (!!error) {
    this.title = this.title || error.name || error.statusText || 'Error';
    this.message = this.message || error.message;
  }
  if (!!error && !!error.response && !!error.response.obj && !!error.response.obj.error && !!error.response.obj.error.data ) {
    const data = error.response.obj.error.data;
    this.title = data.name || this.title;
    this.message = data.message || this.message;
  }
  if (!!error) {
    console.error(error);// eslint-disable-line no-console
  }

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
