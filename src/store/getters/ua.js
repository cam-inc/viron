export default {
  /**
   * 全情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    return context.state.ua;
  }
};
