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
    let url;
    return Promise
      .resolve()
      .then(() => {
        const endpoint = JSON.parse(decodeURIComponent(route.queries.endpoint));
        url = endpoint.url;
        return store.action('endpoints.mergeOneWithKey', endpoint);
      })
      .then(() => store.action('modals.add', 'viron-error', {
        title: 'エンドポイント追加',
        message: `エンドポイント(${url})が一覧に追加されました。`
      }))
      .then(() => {
        replace('/');
      })
      .catch(err => store.action('modals.add', 'viron-error', {
        title: 'エンドポイント追加 失敗',
        message: `エンドポイント(${url})を追加出来ませんでした。`,
        error: err
      }));
  }
};
