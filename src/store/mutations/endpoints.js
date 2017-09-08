import forOwn from 'mout/object/forOwn';
import find from 'mout/object/find';
import keys from 'mout/object/keys';
import ObjectAssign from 'object-assign';
import shortid from 'shortid';
import storage from 'store';
import { constants as states } from '../states';

export default {
  /**
   * 1件のエンドポイントを追加します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {Object} endpoint
   * @return {Array}
   */
  add: (context, endpointKey, endpoint) => {
    context.state.endpoints[endpointKey] = endpoint;
    storage.set('endpoints', context.state.endpoints);
    return [states.ENDPOINTS];
  },

  /**
   * 指定されたエンドポイントを削除します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @return {Array}
   */
  remove: (context, endpointKey) => {
    delete context.state.endpoints[endpointKey];
    storage.set('endpoints', context.state.endpoints);
    return [states.ENDPOINTS];
  },

  /**
   * 全てのエンドポイントを削除します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  removeAll: context => {
    context.state.endpoints = {};
    storage.set('endpoints', context.state.endpoints);
    return [states.ENDPOINTS];
  },

  /**
   * 指定されたエンドポイントを更新します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {Object} endpoint
   * @return {Array}
   */
  update: (context, endpointKey, endpoint) => {
    if (!endpoint) {
      context.state.endpoints[endpointKey] = null;
    } else {
      context.state.endpoints[endpointKey] = ObjectAssign({}, context.state.endpoints[endpointKey], endpoint);
    }
    storage.set('endpoints', context.state.endpoints);
    return [states.ENDPOINTS];
  },

  /**
   * 指定されたエンドポイントのtokenを更新します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {String|null} token
   * @return {Array}
   */
  updateToken: (context, endpointKey, token) => {
    if (!!context.state.endpoints[endpointKey]) {
      context.state.endpoints[endpointKey].token = token;
    }
    storage.set('endpoints', context.state.endpoints);
    return [states.ENDPOINTS];
  },

  /**
   * 新エンドポイント群をmergeします。
   * @param {riotx.Context} context
   * @param {Object} endpoints
   * @return {Array}
   */
  mergeAll: (context, endpoints) => {
    const modifiedEndpoint = ObjectAssign({}, context.state.endpoints);
    let newEndpoints = {};

    forOwn(endpoints, (endpoint) => {
      let duplicatedEndpoint = find(modifiedEndpoint, val => {
        return endpoint.url === val.url;
      });

      if (!duplicatedEndpoint) {
        const key = shortid.generate();
        modifiedEndpoint[key] = endpoint;
      } else {
        const searchKeys = keys(modifiedEndpoint);
        const resultKey = searchKeys.filter((key) => {
          return modifiedEndpoint[key] === duplicatedEndpoint;
        });
        modifiedEndpoint[resultKey] = endpoint;
      }
    });

    context.state.endpoints = modifiedEndpoint;
    storage.set('endpoints', modifiedEndpoint);
    return [states.ENDPOINTS];
  }
};
