export default {
  /**
   * 有効状態を返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  enabled: context => {
    return context.state.menu.isEnabled;
  }
};
