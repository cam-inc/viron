import forEach from 'mout/array/forEach';
import sortBy from 'mout/array/sortBy';
import isNumber from 'mout/lang/isNumber';
import isObject from 'mout/lang/isObject';
import forOwn from 'mout/object/forOwn';
import find from 'mout/object/find';
import ObjectAssign from 'object-assign';
import shortid from 'shortid';
import storage from 'store';
import exporter from './exporter';

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

export default exporter('endpoints', {
  /**
   * 1件のエンドポイントを追加します。
   * @param {Object} state
   * @param {String} endpointKey
   * @param {Object} endpoint
   * @return {Array}
   */
  add: (state, endpointKey, endpoint) => {
    // order値が指定されていなければ自動的に設定する。
    if (!isNumber(endpoint.order)) {
      // リストの先頭に配置するために意図的にマイナス値を付与。
      endpoint.order = -1;
    }
    const version = state.application.version;
    let newEndpoints = ObjectAssign({}, state.endpoints[version]);
    newEndpoints[endpointKey] = endpoint;
    newEndpoints = putEndpointsInOrder(newEndpoints);
    state.endpoints[version] = newEndpoints;
    storage.set('endpoints', state.endpoints);
    return ['endpoints'];
  },

  /**
   * 指定されたエンドポイントを削除します。
   * @param {Object} state
   * @param {String} endpointKey
   * @return {Array}
   */
  remove: (state, endpointKey) => {
    const version = state.application.version;
    let newEndpoints = ObjectAssign({}, state.endpoints[version]);
    delete newEndpoints[endpointKey];
    newEndpoints = putEndpointsInOrder(newEndpoints);
    state.endpoints[version] = newEndpoints;
    storage.set('endpoints', state.endpoints);
    return ['endpoints'];
  },

  /**
   * 全てのエンドポイントを削除します。
   * @param {Object} state
   * @return {Array}
   */
  removeAll: state => {
    const version = state.application.version;
    state.endpoints[version] = {};
    storage.set('endpoints', state.endpoints);
    return ['endpoints'];
  },

  /**
   * 指定されたエンドポイントを更新します。
   * @param {Object} state
   * @param {String} endpointKey
   * @param {Object} endpoint
   * @return {Array}
   */
  update: (state, endpointKey, endpoint) => {
    const version = state.application.version;
    const endpoints = state.endpoints[version];
    if (!endpoint) {
      delete endpoints[endpointKey];
    } else {
      endpoints[endpointKey] = ObjectAssign({}, endpoints[endpointKey], endpoint);
    }
    storage.set('endpoints', state.endpoints);
    return ['endpoints'];
  },

  /**
   * 指定されたエンドポイントのtokenを更新します。
   * @param {Object} state
   * @param {String} endpointKey
   * @param {String|null} token
   * @return {Array}
   */
  updateToken: (state, endpointKey, token) => {
    const version = state.application.version;
    const endpoints = state.endpoints[version];
    if (!!endpoints[endpointKey]) {
      endpoints[endpointKey].token = token;
    }
    storage.set('endpoints', state.endpoints);
    return ['endpoints'];
  },

  /**
   * 新エンドポイント群をmergeします。
   * @param {Object} state
   * @param {Object} endpoints
   * @return {Array}
   */
  mergeAll: (state, endpoints) => {
    const version = state.application.version;
    let modifiedEndpoints = ObjectAssign({}, state.endpoints[version]);

    forOwn(endpoints, endpoint => {
      let duplicatedEndpoint = find(modifiedEndpoints, val => {
        return endpoint.url === val.url;
      });

      if (!duplicatedEndpoint) {
        const key = shortid.generate();
        endpoint.key = key;
        modifiedEndpoints[key] = endpoint;
      } else {
        ObjectAssign(duplicatedEndpoint, endpoint);
      }
    });

    modifiedEndpoints = putEndpointsInOrder(modifiedEndpoints);
    state.endpoints[version] = modifiedEndpoints;
    storage.set('endpoints', state.endpoints);
    return ['endpoints'];
  },

  /**
   * エンドポイント群のorder値を整理します。
   * order値が存在しない場合は後方に配置されます。
   * @param {Object} state
   * @return {Array}
   */
  tidyUpOrder: state => {
    const version = state.application.version;
    const newEndpoints = putEndpointsInOrder(ObjectAssign({}, state.endpoints[version]));
    state.endpoints[version] = newEndpoints;
    storage.set('endpoints', state.endpoints);
    return ['endpoints'];
  },

  /**
   * 指定されたエンドポイントのorder値を変更します。
   * 他エンドポイントのorder値もインクリメントされます。
   * @param {Object} state
   * @param {String} endpointKey
   * @param {Number} newOrder
   * @return {Array}
   */
  changeOrder: (state, endpointKey, newOrder) => {
    const version = state.application.version;
    let newEndpoints = ObjectAssign({}, state.endpoints[version]);
    // x番目とx+1番目の中間に配置するために0.5をマイナスしている。
    newEndpoints[endpointKey].order = newOrder - 0.5;
    newEndpoints = putEndpointsInOrder(newEndpoints);
    state.endpoints[version] = newEndpoints;
    storage.set('endpoints', state.endpoints);
    return ['endpoints'];
  },

  /**
   * ゴミとなるendpointが存在する場合は削除します。
   * @param {Object} state
   * @return {Array}
   */
  cleanup: state => {
    const version = state.application.version;
    let newEndpoints = ObjectAssign({}, state.endpoints[version]);
    forOwn(newEndpoints, (endpoint, key) => {
      if (!isObject(endpoint)) {
        delete newEndpoints[key];
      }
    });
    state.endpoints[version] = newEndpoints;
    storage.set('endpoints', state.endpoints);
    return ['endpoints'];
  }
});
