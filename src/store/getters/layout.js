export default {
  /**
   * endpointリストのgridレイアウトのcolumn数を返します。
   * @param {riotx.Context} context
   * @return {Number}
   */
  endpointsGridColumnCount: context => {
    return context.state.layout.endpointsGridColumnCount;
  },

  /**
   * componentリストのgridレイアウトのcolumn数を返します。
   * @param {riotx.Context} context
   * @return {Number}
   */
  componentsGridColumnCount: context => {
    return context.state.layout.componentsGridColumnCount;
  }
};
