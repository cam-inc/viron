import '../../../../components/viron-error/index.tag';
import i18n from '../../../../core/i18n';

export default function() {
  const store = this.riotx.get();

  this.handleClearButtonTap = () => {
    Promise
      .resolve()
      .then(() => store.action('endpoints.removeAll'))
      .then(() => {
        this.close();
        return store.action('toasts.add', {
          message: i18n.get('vrn.header.menu.clear.info')
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
