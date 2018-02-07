import ObjectAssign from 'object-assign';
import shortid from 'shortid';
import { fetch } from '../../core/fetch';
import exporter from './exporter';

export default exporter('endpoints', {
  /**
   * 1件のエンドポイントを追加します。
   * @param {riotx.Context} context
   * @param {String} url
   * @return {Promise}
   */
  add: (context, url) => {
    const baseNewEndpoint = {
      url: url,
      token: null,
      title: '',
      name: '',
      description: '',
      version: '',
      color: '',
      thumbnail: null,
      tags: [],
      theme: 'standard'
    };

    return Promise
      .resolve()
      .then(() => fetch(context, url))
      .then(() => {
        // 誰でもアクセス可能なエンドポイントの場合はここに来る。
        const key = shortid.generate();
        const newEndpoint = ObjectAssign({}, baseNewEndpoint, {
          key
        });
        context.commit('endpoints.add', key, newEndpoint);
      })
      .catch(err => {
        // 401エラーは想定内。
        // 401 = endpointが存在しているので認証エラーになる。
        if (err.status !== 401) {
          throw err;
        }
        // 401以外 = endpointが存在しない。
        const key = shortid.generate();
        const newEndpoint = ObjectAssign({}, baseNewEndpoint, {
          key
        });
        context.commit('endpoints.add', key, newEndpoint);
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
        context.commit('endpoints.update', key, newEndpoint);
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
        context.commit('endpoints.remove', key);
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
        context.commit('endpoints.removeAll');
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
        context.commit('endpoints.mergeAll', endpoints);
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
        endpoint.key = key;
        context.commit('endpoints.add', key, endpoint);
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
        context.commit('endpoints.tidyUpOrder');
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
        context.commit('endpoints.changeOrder', endpointKey, newOrder);
      });
  },

  /**
   * ゴミとなるエンドポイントを削除します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  cleanup: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('endpoints.cleanup');
      });
  }
});
