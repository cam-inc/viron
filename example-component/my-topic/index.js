export default function() {
  const store = this.riotx.get();

  this.error = null;
  this.topics = [];
  this.postOperation = null;

  /**
   * OASに従いGETリクエストを送信します。
   * @return {Promise}
   */
  const getData = () => {
    return Promise
      .resolve()
      .then(() => store.action('components.get', this.opts.id, this.opts.def))
      .then(() => {
        this.error = null;
        this.update();
      })
      .catch(err => {
        if (err.status === 401) {
          this.error = '認証エラー。';
        } else {
          const api = this.opts.def.api;
          this.error = `[${api.method.toUpperCase()} ${api.path}]通信に失敗しました。`;
        }
        this.update();
      });
  };

  /**
   * 入力フォームを開きます。
   * @param {Object} operationObject
   * @param {Object} initialValue
   */
  const openOperationDrawer = (operationObject, initialVal) => {
    store.action('drawers.add', 'viron-components-page-operation', {
      operationObject,
      initialVal,
      onSuccess: () => {
        getData();
      }
    });
  };

  this.listen(this.opts.id, () => {
    this.topics = store.getter('components.response', this.opts.id);
    this.postOperation = store.getter('components.postOperation', this.opts.id);
    this.update();
  });

  this.on('mount', () => {
    getData();
  }).on('unmount', () => {
    store.action('components.remove', this.opts.id);
  });

  this.handlePostButtonTap = () => {
    openOperationDrawer(this.postOperation);
  };
}
