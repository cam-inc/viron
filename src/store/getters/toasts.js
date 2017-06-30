export default {
  /**
   * 全てのトースト情報を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  all: context => {
    return context.state.toasts;
  }
};
