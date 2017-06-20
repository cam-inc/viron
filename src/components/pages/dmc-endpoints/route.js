import { constants as actions } from '../../../store/actions';
import { constants as getters } from '../../../store/getters';
import '../../atoms/dmc-message/index.tag';

export default {
  /**
   * ページ遷移前の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @param {Function} replace
   * @return {Promise}
   */
  onBefore: (store, route, replace) => {
    const current = store.getter(getters.CURRENT);
    if (current) {
      return Promise
        .resolve()
        .then(() => {
          replace(`/${current}`);
        })
        .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
          error: err
        }));
    }
    return Promise
      .resolve();
  },

  /**
   * ページ遷移時の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @return {Promise}
   */
  onEnter: (store, route) => {// eslint-disable-line no-unused-vars
    return store.action(actions.LOCATION_UPDATE, {
      name: 'endpoints',
      route
    });
  }
};
