export default {
  /**
   * 全てのモーダル情報を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  all: context => {
    return context.state.modal;
  }
};
