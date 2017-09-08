import filter from 'mout/array/filter';
import forEach from 'mout/array/forEach';
import sortBy from 'mout/array/sortBy';
import find from 'mout/object/find';
import forOwn from 'mout/object/forOwn';
import size from 'mout/object/size';
import contains from 'mout/string/contains';
import ObjectAssign from 'object-assign';

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

export default {
  /**
   * 全endpointを返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    return context.state.endpoints;
  },

  /**
   * 全endpointをorder昇順の配列として返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  allByOrder: context => {
    let endpoints = ObjectAssign(context.state.endpoints);
    endpoints = sortByOrder(endpoints);
    return endpoints;
  },

  /**
   * 全endpointをorder昇順のfilter済み配列として返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  allByOrderFiltered: context => {
    let endpoints = ObjectAssign(context.state.endpoints);
    endpoints = sortByOrder(endpoints);
    endpoints = filterBy(endpoints, context.state.application.endpointFilterText);
    return endpoints;
  },

  /**
   * endpoint数を返します。
   * @param {riotx.Context} context
   * @return {Number}
   */
  count: context => {
    return size(context.state.endpoints);
  },

  /**
   * 認証トークンを省いた全endpointを返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  allWithoutToken: context => {
    const endpoints = ObjectAssign({}, context.state.endpoints);
    // 認証用トークンはexport対象外とする。
    forOwn(endpoints, endpoint => {
      delete endpoint.token;
    });
    return endpoints;
  },

  /**
   * 指定keyにマッチするendpointを返します。
   * @param {riotx.Context} context
   * @param {String} key
   * @return {Object}
   */
  one: (context, key) => {
    return context.state.endpoints[key];
  },

  /**
   * 指定urlにマッチするendpointを返します。
   * @param {riotx.Context} context
   * @param {String} url
   * @return {Object}
   */
  oneByURL: (context, url) => {
    const endpoints = context.state.endpoints;
    return find(endpoints, endpoint => {
      return endpoint.url === url;
    });
  }

};
