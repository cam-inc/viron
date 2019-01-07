import '../../components/viron-error/index.tag';
import i18n from '../../core/i18n';

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
      tasks.push(store.action('auth.update', endpointKey, decodeURIComponent(token)));
    } else {
      to = '/';
      tasks.push(store.action('auth.remove', endpointKey));
      tasks.push(store.action('modals.add', 'viron-error', {
        title: i18n.get('pg.oauthredirect.error_title'),
        message: i18n.get('pg.oauthredirect.error_message')
      }));
    }

    return Promise
      .all(tasks)
      .then(() => {
        replace(to);
      })
      .catch(err => store.action('modals.add', 'viron-error', {
        error: err
      }));
  }
};
