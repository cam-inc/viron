import '../../../../components/viron-error/index.tag';
import './qrcode/index.tag';

export default function() {
  const store = this.riotx.get();

  // サインイン済みか否か。
  this.isSignined = !!this.opts.endpoint.token;

  this.handleQRCodeButtonTap = () => {
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

  this.handleDeleteButtonTap = () => {
    Promise
      .resolve()
      .then(() => store.action('endpoints.remove', this.opts.endpoint.key))
      .then(() => store.action('toasts.add', {
        message: 'エンドポイントを削除しました。'
      }))
      .then(() => {
        this.close();
      })
      .catch(err => store.action('modals.add', 'viron-error', {
        error: err
      }));
  };

  this.handleSignoutButtonTap = () => {
    Promise
      .resolve()
      .then(() => store.action('auth.remove', this.opts.endpoint.key))
      .then(() => store.action('toasts.add', {
        message: 'ログアウトしました。'
      }))
      .then(() => {
        this.close();
      })
      .catch(err => store.action('modals.add', 'viron-error', {
        error: err
      }));
  };
}
