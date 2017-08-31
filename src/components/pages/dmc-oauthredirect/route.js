import { constants as actions } from '../../../store/actions';

export default {
  /**
   * ページ遷移前の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @param {Function} replace
   * @return {Promise}
   */
  onBefore: (store, route, replace) => {
    const endpointKey = route.params.endpointKey;
    const token = route.queries.token;
    // tokenが存在したらOAuth認証成功とする。
    const isAuthorized = !!token;
    let to;
    const tasks = [];
    if (isAuthorized) {
      to = `/${endpointKey}`;
      tasks.push(store.action(actions.AUTH_UPDATE, endpointKey, token));
    } else {
      to = '/';
      tasks.push(store.action(actions.AUTH_REMOVE, endpointKey));
      tasks.push(store.action(actions.MODALS_ADD, 'dmc-message', {
        message: 'TODO: oauth失敗'
      }));
    }

    return Promise
      .all(tasks)
      .then(() => {
        replace(to);
      })
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        error: err
      }));
  }
};
