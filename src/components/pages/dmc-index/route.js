import { constants as actions } from '../../../store/actions';

export default {
  /**
   * ページ遷移時の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @return {Promise}
   */
  onEnter: (store, route) => {// eslint-disable-line no-unused-vars
    return store.action(actions.LOCATION_UPDATE, {
      name: 'index',
      route
    });
  }
};
