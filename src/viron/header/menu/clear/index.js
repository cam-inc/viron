import '../../../../components/viron-error/index.tag';

export default function() {
  const store = this.riotx.get();

  this.handleClearButtonTap = () => {
    Promise
      .resolve()
      .then(() => store.action('endpoints.removeAll'))
      .then(() => {
        this.close();
        return store.action('toasts.add', {
          message: 'エンドポイント一覧を削除しました。'
        });
      })
      .catch(err => {
        this.close();
        return store.action('modals.add', 'viron-error', {
          error: err
        });
      });
  };
}
