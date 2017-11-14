import { constants as actions } from '../../store/actions';

export default {
  /**
   * ページ遷移時の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @return {Promise}
   */
  onEnter: (store, route) => {
    return store.action(actions.LOCATION_UPDATE, {
      name: 'notfound',
      route
    });
  }
};
