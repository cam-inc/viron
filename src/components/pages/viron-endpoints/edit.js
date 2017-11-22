export default function() {
  const store = this.riotx.get();

  this.memo = this.opts.endpoint.memo || '';

  this.handleMemoChange = newMemo => {
    this.memo = newMemo;
    this.update();
  };

  this.handleEditButtonClick = () => {
    Promise
      .resolve()
      .then(() => store.action('endpoints.update', this.opts.endpointKey, {
        memo: this.memo
      }))
      .then(() => store.action('toasts.add', {
        message: 'エンドポイントを編集しました。'
      }))
      .then(() => {
        this.close();
      })
      .catch(err => store.action('toasts.add', {
        type: 'error',
        message: err.message
      }));
  };

  this.handleCancelButtonClick = () => {
    this.close();
  };
}
