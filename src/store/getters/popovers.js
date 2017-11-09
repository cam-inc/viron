export default {
  /**
   * 全ての吹き出し情報を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  all: context => {
    return context.state.popovers;
  }
};
