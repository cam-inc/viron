import { fetch } from '../../core/fetch';
import { constants as getters } from '../getters';
import { constants as mutations } from '../mutations';

export default {
  /**
   * 1件のエンドポイントを追加します。
   * @param {riotx.Context} context
   * @param {String} url
   * @param {String} memo
   * @return {Promise}
   */
  add: (context, url, memo) => {
    return Promise
      .resolve()
      .then(() => fetch(context, url))
      .catch(err => {
        // 401エラーは想定内。
        // 401 = endpointが存在しているので認証エラーになる。
        // 401以外 = endpointが存在しない。
        if (err.status !== 401) {
          throw err;
        }
        const key = context.getter(getters.ENDPOINTS_NEXT_KEY);
        const newEndpoint = {
          url: url,
          memo: memo,
          token: null,
          name: '-',
          description: '-',
          version: '',
          color: '',
          thumbnail: './img/dmc_default.png',
          tags: []
        };
        context.commit(mutations.ENDPOINTS_ADD, key, newEndpoint);
      });
  },

  /**
   * 1件のエンドポイントを更新します
   * @param {riotx.Context} context
   * @param {String} url
   * @param {Object} newEndpoint
   * @return {Promise}
   */
  update: (context, key, newEndpoint) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.ENDPOINTS_UPDATE, key, newEndpoint);
      });
  },

  /**
   * 1件のエンドポイントを削除します。
   * @param {riotx.Context} context
   * @param {String} key
   * @return {Promise}
   */
  remove: (context, key) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.ENDPOINTS_REMOVE, key);
      });
  },

  /**
   * 全てのエンドポイントを削除します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  removeAll: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.ENDPOINTS_REMOVE_ALL);
      });
  }
};
