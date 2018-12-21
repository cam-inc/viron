import '../../../../components/viron-error/index.tag';
import './qrcode/index.tag';
import i18n from '../../../../core/i18n';

export default function() {
  const store = this.riotx.get();

  // サインイン済みか否か。
  const isSignined = !!this.opts.endpoint.token;
  const isDesktop = store.getter('layout.isDesktop');

  this.list = [];
  if (isDesktop) {
    this.list.push({ id: 'qrcode', label: i18n.get('qrcode') });
  }
  this.list.push({ id: 'remove', label: i18n.get('endpoint_delete') });
  if (isSignined) {
    this.list.push({ id: 'signout', label: i18n.get('logout') });
  }

  const showQRCode = () => {
    Promise
      .resolve()
      .then(() => store.action('modals.add', 'viron-endpoints-page-endpoint-menu-qrcode', {
        endpoint: this.opts.endpoint
      }))
      .then(() => {
        this.close();
      })
      .catch(err => store.action('modals.add', 'viron-error', {
        error: err
      }));
  };

  const removeEndpoint = () => {
    Promise
      .resolve()
      .then(() => store.action('endpoints.remove', this.opts.endpoint.key))
      .then(() => store.action('toasts.add', {
        message: i18n.get('endpoint_delete_info')
      }))
      .then(() => {
        this.close();
      })
      .catch(err => store.action('modals.add', 'viron-error', {
        error: err
      }));
  };

  const signout = () => {
    Promise
      .resolve()
      .then(() => store.action('auth.remove', this.opts.endpoint.key))
      .then(() => store.action('toasts.add', {
        message: i18n.get('logout_info')
      }))
      .then(() => {
        this.close();
      })
      .catch(err => store.action('modals.add', 'viron-error', {
        error: err
      }));
  };

  this.handleItemSelect = id => {
    switch (id) {
    case 'qrcode':
      showQRCode();
      break;
    case 'remove':
      removeEndpoint();
      break;
    case 'signout':
      signout();
      break;
    default:
      break;
    }
  };
}
