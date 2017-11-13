import { constants as actions } from '../../store/actions';
import '../../components/viron-error/index.tag';

export default {
  /**
   * ページ遷移前の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @param {Function} replace
   * @return {Promise}
   */
  onBefore: store => {
    return Promise
      .resolve()
      .then(() => Promise.all([
        store.action(actions.CURRENT_REMOVE),
        store.action(actions.PAGE_REMOVE),
        store.action(actions.OAS_CLEAR),
        store.action(actions.VIRON_REMOVE)
      ]))
      .catch(err => store.action(actions.MODALS_ADD, 'viron-error', {
        error: err
      }));
  },

  /**
   * ページ遷移時の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @return {Promise}
   */
  onEnter: (store, route) => {
    return store.action(actions.LOCATION_UPDATE, {
      name: 'endpoints',
      route
    });
  }
};
