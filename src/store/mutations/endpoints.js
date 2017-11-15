import forEach from 'mout/array/forEach';
import sortBy from 'mout/array/sortBy';
import isNumber from 'mout/lang/isNumber';
import forOwn from 'mout/object/forOwn';
import find from 'mout/object/find';
import ObjectAssign from 'object-assign';
import shortid from 'shortid';
import storage from 'store';

/**
 * 受け取ったエンドポイント群をきれいに並び替えます。
 * order値が存在しない場合は後方に配置されます。
 * @param {Object} endpoints
 * @return {Object}
 */
const putEndpointsInOrder = endpoints => {
  // どのorder値よりも大きいであろう適当な値。
  const bigNumber = 9999;
  let ordered = [];
  forOwn(endpoints, (endpoint, key) => {
    ordered.push({
      key,
      order: (isNumber(endpoint.order) ? endpoint.order : bigNumber)
    });
  });
  ordered = sortBy(ordered, obj => {
    return obj.order;
  });
  forEach(ordered, (obj, order) => {
    endpoints[obj.key].order = order;
  });
  return endpoints;
};

export default {
  /**
   * 1件のエンドポイントを追加します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {Object} endpoint
   * @return {Array}
   */
  add: (context, endpointKey, endpoint) => {
    // order値が指定されていなければ自動的に設定する。
    if (!isNumber(endpoint.order)) {
      // リストの先頭に配置するために意図的にマイナス値を付与。
      endpoint.order = -1;
    }
    let newEndpoints = ObjectAssign({}, context.state.endpoints);
    newEndpoints[endpointKey] = endpoint;
    newEndpoints = putEndpointsInOrder(newEndpoints);
    context.state.endpoints = newEndpoints;
    storage.set('endpoints', context.state.endpoints);
    return ['endpoints'];
  },

  /**
   * 指定されたエンドポイントを削除します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @return {Array}
   */
  remove: (context, endpointKey) => {
    let newEndpoints = ObjectAssign({}, context.state.endpoints);
    delete newEndpoints[endpointKey];
    newEndpoints = putEndpointsInOrder(newEndpoints);
    context.state.endpoints = newEndpoints;
    storage.set('endpoints', context.state.endpoints);
    return ['endpoints'];
  },

  /**
   * 全てのエンドポイントを削除します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  removeAll: context => {
    context.state.endpoints = {};
    storage.set('endpoints', context.state.endpoints);
    return ['endpoints'];
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
    return ['endpoints'];
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
    return ['endpoints'];
  },

  /**
   * 新エンドポイント群をmergeします。
   * @param {riotx.Context} context
   * @param {Object} endpoints
   * @return {Array}
   */
  mergeAll: (context, endpoints) => {
    let modifiedEndpoints = ObjectAssign({}, context.state.endpoints);

    forOwn(endpoints, endpoint => {
      let duplicatedEndpoint = find(modifiedEndpoints, val => {
        return endpoint.url === val.url;
      });

      if (!duplicatedEndpoint) {
        const key = shortid.generate();
        modifiedEndpoints[key] = endpoint;
      } else {
        ObjectAssign(duplicatedEndpoint, endpoint);
      }
    });

    modifiedEndpoints = putEndpointsInOrder(modifiedEndpoints);
    context.state.endpoints = modifiedEndpoints;
    storage.set('endpoints', modifiedEndpoints);
    return ['endpoints'];
  },

  /**
   * エンドポイント群のorder値を整理します。
   * order値が存在しない場合は後方に配置されます。
   * @param {riotx.Context} context
   * @return {Array}
   */
  tidyUpOrder: context => {
    const newEndpoints = putEndpointsInOrder(ObjectAssign(context.state.endpoints));
    context.state.endpoints = newEndpoints;
    storage.set('endpoints', newEndpoints);
    return ['endpoints'];
  },

  /**
   * 指定されたエンドポイントのorder値を変更します。
   * 他エンドポイントのorder値もインクリメントされます。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {Number} newOrder
   * @return {Array}
   */
  changeOrder: (context, endpointKey, newOrder) => {
    let newEndpoints = ObjectAssign(context.state.endpoints);
    // x番目とx+1番目の中間に配置するために0.5をマイナスしている。
    newEndpoints[endpointKey].order = newOrder - 0.5;
    newEndpoints = putEndpointsInOrder(newEndpoints);
    context.state.endpoints = newEndpoints;
    storage.set('endpoints', newEndpoints);
    return ['endpoints'];
  }
};
