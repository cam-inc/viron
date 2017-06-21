import getParam from 'mout/queryString/getParam';
import riot from 'riot';
import mixin from './core/mixin';
import './core/polyfill';
import router from './core/router';
import swagger from './core/swagger';
import store from './store';
import { constants as actions } from './store/actions';
import { constants as getters } from './store/getters';
import './dmc/index.tag';
import './components/atoms/dmc-message/index.tag';

// エントリーポイント。
document.addEventListener('DOMContentLoaded', () => {
  // TODO: debug用なので後で消すこと。
  window.swagger = swagger;

  let _store;
  Promise
    .resolve()
    .then(() => mixin.init())
    .then(() => store.init())
    .then(store => {
      _store = store;
      // TODO: debug用なので後で消すこと。
      window.store = store;
    })
    .then(() => {
      // OAuth認証後のリダイレクトではクエリにtokenが格納されている。
      // tokenがあれっばOAuth認証とみなす。
      const token = getParam(location.href, 'token');
      if (!token) {
        return Promise.resolve();
      }

      const oauthEndpointKey = _store.getter(getters.OAUTH_ENDPOINT_KEY);
      return Promise
        .all([
          _store.action(actions.CURRENT_UPDATE, oauthEndpointKey),
          _store.action(actions.AUTH_UPDATE, oauthEndpointKey, token),
          _store.action(actions.OAUTH_ENDPOINT_KEY_REMOVE)
        ])
        .then(() => {
          location.href = `${location.origin}${location.pathname}`;
        });
    })
    .then(() => {
      riot.mount('dmc');
    })
    .then(() => router.init(_store))
    .catch(err => _store.action(actions.MODALS_ADD, 'dmc-message', {
      error: err
    }));
});
