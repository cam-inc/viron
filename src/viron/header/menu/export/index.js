import download from 'downloadjs';
import '../../../../components/viron-error/index.tag';

export default function() {
  const store = this.riotx.get();

  const endpoints = store.getter('endpoints.allWithoutToken');

  this.handleExportButtonTap = () => {
    Promise
      .resolve()
      .then(() => {
        download(JSON.stringify(endpoints), 'endpoints.json', 'application/json');
      })
      .then(() => {
        this.close();
        return store.action('toasts.add', {
          message: 'エンドポイント一覧を書き出しました。'
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
