import filter from 'mout/array/filter';
import forEach from 'mout/array/forEach';
import sortBy from 'mout/array/sortBy';
import deepClone from 'mout/lang/deepClone';
import find from 'mout/object/find';
import forOwn from 'mout/object/forOwn';
import size from 'mout/object/size';
import contains from 'mout/string/contains';
import ObjectAssign from 'object-assign';
import exporter from './exporter';

/**
 * 受け取ったエンドポイント群をorder昇順の配列として返します。
 * @param {Object} endpoints
 * @return {Array}
 */
const sortByOrder = endpoints => {
  let endpointsByOrder = [];
  forOwn(endpoints, (endpoint, key) => {
    endpoint.key = key;
    endpointsByOrder.push(endpoint);
  });
  endpointsByOrder = sortBy(endpointsByOrder, endpoint => {
    return endpoint.order;
  });
  return endpointsByOrder;
};

/**
 * 受け取ったエンドポイント群をfilterして返します。
 * @param {Array} endpoints
 * @param {String} filterText
 * @return {Array}
 */
const filterBy = (endpoints, filterText) => {
  filterText = filterText || '';
  filterText = filterText.replace(/　/g, ' ');// eslint-disable-line no-irregular-whitespace
  filterText = filterText.replace(/,/g, ' ');
  const targetTexts = filter((filterText || '').split(' '), targetText => {
    return !!targetText;
  });
  if (!targetTexts.length) {
    return endpoints;
  }

  return filter(endpoints, endpoint => {
    let isMatched = false;
    forEach(targetTexts, targetText => {
      if (contains(endpoint.url, targetText)) {
        isMatched = true;
      }
      if (contains(endpoint.title, targetText)) {
        isMatched = true;
      }
      if (contains(endpoint.name, targetText)) {
        isMatched = true;
      }
      if (contains(endpoint.description, targetText)) {
        isMatched = true;
      }
      if (contains(endpoint.memo, targetText)) {
        isMatched = true;
      }
      forEach(endpoint.tags || [], tag => {
        if (contains(tag, targetText)) {
          isMatched = true;
        }
      });
    });
    return isMatched;
  });
};

export default exporter('endpoints', {
  /**
   * 全endpointを返します。
   * @param {Object} state
   * @return {Object}
   */
  all: state => {
    const version = state.application.version;
    return state.endpoints[version] || {};
  },

  /**
   * 全endpointをorder昇順の配列として返します。
   * @param {Object} state
   * @return {Array}
   */
  allByOrder: state => {
    const version = state.application.version;
    let endpoints = ObjectAssign({}, state.endpoints[version]);
    endpoints = sortByOrder(endpoints);
    return endpoints;
  },

  /**
   * 全endpointをorder昇順のfilter済み配列として返します。
   * @param {Object} state
   * @return {Array}
   */
  allByOrderFiltered: state => {
    const version = state.application.version;
    let endpoints = ObjectAssign({}, state.endpoints[version]);
    endpoints = sortByOrder(endpoints);
    endpoints = filterBy(endpoints, state.application.endpointFilterText);
    return endpoints;
  },

  /**
   * endpoint数を返します。
   * @param {Object} state
   * @return {Number}
   */
  count: state => {
    const version = state.application.version;
    const endpoints = state.endpoints[version] || {};
    return size(endpoints);
  },

  /**
   * 認証トークンを省いた全endpointを返します。
   * @param {Object} state
   * @return {Object}
   */
  allWithoutToken: state => {
    const version = state.application.version;
    const endpoints = deepClone(state.endpoints[version]);
    // 認証用トークンはexport対象外とする。
    forOwn(endpoints, endpoint => {
      delete endpoint.token;
    });
    return endpoints;
  },

  /**
   * 指定keyにマッチするendpointを返します。
   * @param {Object} state
   * @param {String} key
   * @return {Object}
   */
  one: (state, key) => {
    const version = state.application.version;
    const endpoints = state.endpoints[version] || {};
    return endpoints[key];
  },

  /**
   * 指定urlにマッチするendpointを返します。
   * @param {Object} state
   * @param {String} url
   * @return {Object}
   */
  oneByURL: (state, url) => {
    const version = state.application.version;
    const endpoints = state.endpoints[version] || {};
    return find(endpoints, endpoint => {
      return endpoint.url === url;
    });
  }

});
