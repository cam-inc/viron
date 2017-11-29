import riot from 'riot';
import i18n from './core/i18n';
import mixin from './core/mixin';
import './core/polyfill';
import router from './core/router';
import store from './store';
import './viron/index.tag';
import './components/atoms/viron-message/index.tag';

// エントリーポイント。
document.addEventListener('DOMContentLoaded', () => {
  let mainStore;
  Promise
    .resolve()
    .then(() => i18n.init())
    .then(() => mixin.init())
    .then(() => store.init())
    .then(store => {
      mainStore = store;
      // debug用にglobal公開しておく。
      window.store = store;
    })
    .then(() => {
      riot.mount('viron');
    })
    .then(() => Promise.all([
      mainStore.action('endpoints.tidyUpOrder'),
      mainStore.action('ua.setup')
    ]))
    .then(() => router.init(mainStore))
    .catch(err => mainStore.action('modals.add', 'viron-message', {
      message: 'Viron起動に失敗しました。Viron担当者にお問い合わせ下さい。',
      error: err
    }));
});