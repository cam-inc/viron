export default {
  /**
   * 全てのドローワー情報を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  all: context => {
    return context.state.drawers;
  }
};
