import sortBy from 'mout/array/sortBy';
import find from 'mout/object/find';
import forOwn from 'mout/object/forOwn';
import size from 'mout/object/size';
import ObjectAssign from 'object-assign';

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
    const endpoints = ObjectAssign(context.state.endpoints);
    let endpointsByOrder = [];
    forOwn(endpoints, (endpoint, key) => {
      endpoint.key = key;
      endpointsByOrder.push(endpoint);
    });
    endpointsByOrder = sortBy(endpointsByOrder, endpoint => {
      return endpoint.order;
    });
    return endpointsByOrder;
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
