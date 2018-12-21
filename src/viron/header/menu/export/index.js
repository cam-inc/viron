import download from 'downloadjs';
import '../../../../components/viron-error/index.tag';
import i18n from '../../../../core/i18n';

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
          message: i18n.get('header_menu_export_info')
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
