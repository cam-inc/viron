export default {
  /**
   * 開閉状態を返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  opened: context => {
    return context.state.menu.isOpened;
  },

  /**
   * 有効状態を返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  enabled: context => {
    return context.state.menu.isEnabled;
  }
};
