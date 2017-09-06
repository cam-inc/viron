import { constants as actions } from '../../../store/actions';
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
    let url;
    return Promise
      .resolve()
      .then(() => {
        const endpoint = JSON.parse(decodeURIComponent(route.queries.endpoint));
        url = endpoint.url;
        return store.action(actions.ENDPOINTS_MERGE_ONE_WITH_KEY, endpoint);
      })
      .then(() => store.action(actions.MODALS_ADD, 'dmc-message', {
        title: 'エンドポイント追加',
        message: `エンドポイント(${url})が一覧に追加されました。`
      }))
      .then(() => {
        replace('/');
      })
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        title: 'エンドポイント追加 失敗',
        message: `エンドポイント(${url})を追加出来ませんでした。`,
        error: err
      }));
  }
};
