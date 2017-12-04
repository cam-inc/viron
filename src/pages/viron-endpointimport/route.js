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
    const endpoint = JSON.parse(decodeURIComponent(route.queries.endpoint));
    const url = endpoint.url;

    // 既に登録済みの場合は何もしない。
    if (!!store.getter('endpoints.oneByURL', url)) {
      return Promise
        .resolve()
        .then(() => {
          replace('/');
          store.action('toasts.add', {
            message: `既にエンドポイント(${url})が存在します。`,
          });
        });
    }

    return Promise
      .resolve()
      .then(() => store.action('endpoints.mergeOneWithKey', endpoint))
      .then(() => store.action('modals.add', 'viron-error', {
        title: 'エンドポイント追加',
        message: `エンドポイント(${url})が一覧に追加されました。`
      }))
      .then(() => {
        replace('/');
      })
      .catch(err => {
        replace('/');
        store.action('modals.add', 'viron-error', {
          title: 'エンドポイント追加 失敗',
          message: `エンドポイント(${url})を追加出来ませんでした。`,
          error: err
        });
      });
  }
};
