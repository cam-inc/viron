export default {
  /**
   * componentリストのgridレイアウトのcolumn数を返します。
   * @param {riotx.Context} context
   * @return {Number}
   */
  componentsGridColumnCount: context => {
    return context.state.layout.componentsGridColumnCount;
  }
};
