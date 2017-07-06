import find from 'mout/object/find';
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
