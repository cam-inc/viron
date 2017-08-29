import { constants as states } from '../states';

export default {
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
