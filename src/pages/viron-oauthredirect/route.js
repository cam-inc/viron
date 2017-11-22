import '../../components/viron-error/index.tag';

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
        title: '認証失敗',
        message: 'OAuth認証に失敗しました。正しいアカウントで再度お試し下さい。詳しいエラー原因については管理者に問い合わせて下さい。'
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
