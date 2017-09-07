import riot from 'riot';
import mixin from './core/mixin';
import './core/polyfill';
import router from './core/router';
import store from './store';
import { constants as actions } from './store/actions';
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
      riot.mount('dmc');
    })
    .then(() => Promise.all([
      mainStore.action(actions.ENDPOINTS_TIDY_UP_ORDER),
      mainStore.action(actions.UA_SETUP)
    ]))
    .then(() => router.init(mainStore))
    .catch(err => mainStore.action(actions.MODALS_ADD, 'dmc-message', {
      message: 'Viron起動に失敗しました。Viron担当者にお問い合わせ下さい。',
      error: err
    }));
});
