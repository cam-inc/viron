import { constants as states } from '../states';

export default {
  /**
   * endpointリストのgridレイアウトのcolumn数を更新します。
   * @param {riotx.Context} context
   * @param {Number} count
   * @return {Array}
   */
  updateEndpointsGridColumnCount: (context, count) => {
    context.state.layout.endpointsGridColumnCount = count;
    return [states.LAYOUT];
  },

  /**
   * componentリストのgridレイアウトのcolumn数を更新します。
   * @param {riotx.Context} context
   * @param {Number} count
   * @return {Array}
   */
  updateComponentsGridColumnCount: (context, count) => {
    context.state.layout.componentsGridColumnCount = count;
    return [states.LAYOUT];
  }
};
