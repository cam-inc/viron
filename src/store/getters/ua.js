export default {
  /**
   * 全情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    return context.state.ua;
  },

  /**
   * Safariか否かを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isSafari: context => {
    return !!context.state.ua.safari;
  }
};
