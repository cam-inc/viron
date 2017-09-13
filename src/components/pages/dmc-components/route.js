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
    const endpointKey = route.params.endpointKey;
    const endpoint = store.getter(getters.ENDPOINTS_ONE, endpointKey);

    // endpointが存在しなければTOPに戻す。
    if (!endpoint) {
      return Promise
        .resolve()
        .then(() => {
          replace('/');
        })
        .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
          error: err
        }));
    }

    return Promise
      .resolve()
      .then(() => store.action(actions.CURRENT_UPDATE, endpointKey))
      .then(() => {
        // 無駄な通信を減らすために、`dmc`データを未取得の場合のみfetchする。
        const isDmcExist = store.getter(getters.DMC_EXISTENCE);
        if (isDmcExist) {
          return Promise.resolve();
        }
        return Promise
          .resolve()
          .then(() => store.action(actions.OAS_SETUP, endpointKey, endpoint.url, endpoint.token))
          .then(() => store.action(actions.DMC_GET));
      })
      .then(() => {
        // pageが指定されていない場合は`dmc`のpageリストの先頭項目を自動選択する。
        if (!route.params.page) {
          return Promise.resolve().then(() => {
            const pageName = store.getter(getters.DMC_PAGES_ID_OF, 0);
            replace(`/${endpointKey}/${pageName}`);
          });
        }
        return store.action(actions.PAGE_GET, route.params.page);
      })
      .catch(err => {
        // 401 = 認証エラー
        // 通常エラーと認証エラーで処理を振り分ける。
        if (err.status !== 401) {
          return store.action(actions.MODALS_ADD, 'dmc-message', {
            error: err
          });
        }
        return Promise
          .resolve()
          .then(() => store.action(actions.MODALS_ADD, 'dmc-message', {
            title: '認証切れ',
            message: '認証が切れました。再度ログインして下さい。'
          }))
          .then(() => {
            replace('/');
          });
      });
  },

  /**
   * ページ遷移時の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @return {Promise}
   */
  onEnter: (store, route) => {
    return store.action(actions.LOCATION_UPDATE, {
      name: 'components',
      route
    });
  }
};
