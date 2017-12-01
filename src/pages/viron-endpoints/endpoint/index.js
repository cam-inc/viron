import '../../../components/viron-error/index.tag';
import './menu/index.tag';
import './signin/index.tag';

export default function() {
  const store = this.riotx.get();

  this.handleTap = () => {
    // サインイン済みならばendpointページに遷移させる。
    // サインインしていなければ認証モーダルを表示する。
    const endpointKey = this.opts.endpoint.key;
    Promise
      .resolve()
      .then(() => store.action('auth.validate', endpointKey))
      .then(isValid => {
        if (isValid) {
          this.getRouter().navigateTo(`/${endpointKey}`);
          return Promise.resolve();
        }
        return Promise
          .resolve()
          .then(() => store.action('auth.getTypes', endpointKey))
          .then(authtypes => store.action('modals.add', 'viron-endpoints-page-endpoint-signin', {
            endpoint: this.opts.endpoint,
            authtypes
          }, { isSpread: true }));
      })
      .catch(err => store.action('modals.add', 'viron-error', {
        error: err
      }));
  };

  this.handleMenuTap = e => {
    e.stopPropagation();
    const rect = this.refs.menu.root.getBoundingClientRect();
    store.action('popovers.add', 'viron-endpoints-page-endpoint-menu', {
      endpoint: this.opts.endpoint
    }, {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
      width: 228,
      direction: 'TR'
    });
  };
}
