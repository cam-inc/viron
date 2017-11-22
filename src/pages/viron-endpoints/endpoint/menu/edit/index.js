import '../../../../../components/viron-error/index.tag';

export default function() {
  const store = this.riotx.get();

  this.memo = this.opts.endpoint.memo;

  this.handleMemoChange = newMemo => {
    this.memo = newMemo;
    this.update();
  };

  this.handleSaveButtonSelect = () => {
    Promise
      .resolve()
      .then(() => store.action('endpoints.update', this.opts.endpoint.key, {
        memo: this.memo
      }))
      .then(() => store.action('toasts.add', {
        message: '保存完了。'
      }))
      .then(() => {
        this.close();
      })
      .catch(err => store.action('modals.add', 'viron-error', {
        error: err
      }));
  };

  this.handleCancelButtonSelect = () => {
    this.close();
  };
}
