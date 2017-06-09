export default {
  /**
   * 全情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    return context.state.page;
  },

  /**
   * ページ名を返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  name: context => {
    return context.state.page.name;
  },

  /**
   * ルーティング情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  route: context => {
    return context.state.page.route;
  }
};
