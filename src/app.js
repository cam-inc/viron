import getParam from 'mout/queryString/getParam';
import riot from 'riot';
import mixin from './core/mixin';
import './core/polyfill';
import router from './core/router';
import store from './store';
import { constants as actions } from './store/actions';
import { constants as getters } from './store/getters';
import './dmc/index.tag';
import './components/atoms/dmc-message/index.tag';

// エントリーポイント。
document.addEventListener('DOMContentLoaded', () => {
  let mainStore;
  Promise
    .resolve()
    .then(() => mixin.init())
    .then(() => store.init())
    .then(store => {
      mainStore = store;
      // debug用にglobal公開しておく。
      window.store = store;
    })
    .then(() => {
      // OAuth認証後のリダイレクトではクエリにtokenが格納されている。
      // tokenがあればOAuth認証とみなす。
      const token = getParam(location.href, 'token');
      if (!token) {
        return Promise.resolve();
      }

      const oauthEndpointKey = mainStore.getter(getters.OAUTH_ENDPOINT_KEY);
      return Promise
        .all([
          mainStore.action(actions.CURRENT_UPDATE, oauthEndpointKey),
          mainStore.action(actions.AUTH_UPDATE, oauthEndpointKey, token),
          mainStore.action(actions.OAUTH_ENDPOINT_KEY_REMOVE)
        ])
        .then(() => {
          location.href = `${location.origin}${location.pathname}#/${oauthEndpointKey}`;
        });
    })
    .then(() => {
      riot.mount('dmc');
    })
    .then(() => mainStore.action(actions.UA_SETUP))
    .then(() => router.init(mainStore))
    .catch(err => mainStore.action(actions.MODALS_ADD, 'dmc-message', {
      error: err
    }));
});
