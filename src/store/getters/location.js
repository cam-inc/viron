export default {
  /**
   * 全情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    return context.state.location;
  },

  /**
   * ページ名を返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  name: context => {
    return context.state.location.name;
  },

  /**
   * ルーティング情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  route: context => {
    return context.state.location.route;
  }
};
