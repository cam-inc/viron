import '../../atoms/viron-message/index.tag';
import './edit.tag';
import './qrcode.tag';
import './signin.tag';

export default function() {
  const store = this.riotx.get();

  this.endpoints = store.getter('endpoints.allByOrderFiltered');
  this.endpointsCount = store.getter('endpoints.count');
  this.endpointFilterText = store.getter('application.endpointFilterText');

  this.listen('endpoints', () => {
    this.endpoints = store.getter('endpoints.allByOrderFiltered');
    this.endpointsCount = store.getter('endpoints.count');
    this.update();
  });

  this.listen('application', () => {
    this.endpoints = store.getter('endpoints.allByOrderFiltered');
    this.endpointFilterText = store.getter('application.endpointFilterText');
    this.update();
  });

  this.handleEndpointEntry = key => {
    Promise
      .resolve()
      .then(() => store.action('auth.validate', key))
      .then(isValid => {
        // tokenが有効ならばendpointページに遷移させる。
        // 無効ならサインイン用のモーダルを表示させる。
        if (isValid) {
          this.getRouter().navigateTo(`/${key}`);
          return Promise.resolve();
        }
        return Promise
          .resolve()
          .then(() => store.action('auth.getTypes', key))
          .then(authtypes => store.action('modals.add', 'viron-endpoint-signin', {
            key,
            endpoint: store.getter('endpoints.one', key),
            authtypes,
            onSignin: () => {
              this.getRouter().navigateTo(`/${key}`);
            }
          }));
      })
      .catch(err => store.action('modals.add', 'viron-message', {
        error: err
      }));
  };

  this.handleEndpointEdit = key => {
    Promise
      .resolve()
      .then(() => store.action('modals.add', 'viron-endpoint-edit', {
        endpointKey: key,
        endpoint: store.getter('endpoints.one', key)
      }))
      .catch(err => store.action('modals.add', 'viron-message', {
        error: err
      }));
  };

  this.handleEndpointRemove = key => {
    Promise
      .resolve()
      .then(() => store.action('endpoints.remove', key))
      .then(() => store.action('toasts.add', {
        message: 'エンドポイントを削除しました。'
      }))
      .catch(err => store.action('modals.add', 'viron-message', {
        error: err
      }));
  };

  this.handleEndpointQrCode = key => {
    const endpoint = store.getter('endpoints.one', key);
    Promise
      .resolve()
      .then(() => store.action('modals.add', 'viron-endpoint-qrcode', {
        endpoint
      }))
      .catch(err => store.action('modals.add', 'viron-message', {
        error: err
      }));
  };

  this.handleEndpointLogout = key => {
    Promise
      .resolve()
      .then(() => store.action('auth.remove', key))
      .then(() => store.action('toasts.add', {
        message: 'エンドポイントからログアウトしました。'
      }))
      .catch(err => store.action('modals.add', 'viron-message', {
        error: err
      }));
  };
}
