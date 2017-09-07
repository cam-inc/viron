import shortid from 'shortid';
import { fetch } from '../../core/fetch';
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
        //
        const key = shortid.generate();
        const newEndpoint = {
          url: url,
          memo: memo,
          token: null,
          title: '',
          name: '',
          description: '',
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
  },

  /**
   * 新エンドポイント群を既存エンドポイント群にmergeします。
   * @param {riotx.Context} context
   * @param {Object} endpoints
   * @return {Promise}
   */
  mergeAll: (context, endpoints) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.ENDPOINTS_MERGE_ALL, endpoints);
      });
  },

  /**
   * 一件の新エンドポイントを既存エンドポイント群にmergeします。
   * endpointKeyも新規生成します。
   * @param {riotx.Context} context
   * @param {Object} endpoint
   * @return {Promise}
   */
  mergeOneWithKey: (context, endpoint) => {
    return Promise
      .resolve()
      .then(() => {
        const key = shortid.generate();
        context.commit(mutations.ENDPOINTS_ADD, key, endpoint);
      });
  },

  /**
   * エンドポイントのorder値を整理します。
   * order値が存在しない等への対応を行います。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  tidyUpOrder: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.ENDPOINTS_TIDY_UP_ORDER);
      });
  },

  /**
   * 指定されたエンドポイントのorder値を変更します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {Number} newOrder
   * @return {Promise}
   */
  changeOrder: (context, endpointKey, newOrder) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.ENDPOINTS_CHANGE_ORDER, endpointKey, newOrder);
      });
  }
};
