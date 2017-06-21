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
        if (err.status !== 401) {
          throw err;
        }
        const key = context.getter(getters.ENDPOINTS_NEXT_KEY);
        const newEndpoint = {
          url: url,
          memo: memo,
          token: null,
          name: '',
          description: '',
          version: '',
          color: '',
          // TODO: デフォルト画像を用意すること。
          thumbnail: 'https://dummyimage.com/600x400/000/fff',
          tags: []
        };
        context.commit(mutations.ENDPOINTS_ADD, key, newEndpoint);
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
