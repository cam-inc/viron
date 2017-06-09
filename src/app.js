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
  let _store;
  Promise
    .resolve()
    .then(() => mixin.init())
    .then(() => store.init())
    .then(store => {
      riot.mount('dmc');
      _store = store;
    })
    .then(() => router.init(_store))
    .catch(err => _store.action(actions.MODAL_ADD, 'dmc-message', {
      error: err
    }));
});
