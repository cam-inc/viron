import constants from '../../core/constants';

export default {
  /**
   * 表示サイズを更新します。
   * @param {riotx.Context} context
   * @param {Number} width
   * @param {Number} height
   */
  updateSize: (context, width, height) => {
    context.state.layout.size.width = width;
    context.state.layout.size.height = height;
    if (width > constants.layoutThreshold) {
      context.state.layout.type = constants.layoutTypeDesktop;
    } else {
      context.state.layout.type = constants.layoutTypeMobile;
    }
    return ['layout'];
  },

  /**
   * componentリストのgridレイアウトのcolumn数を更新します。
   * @param {riotx.Context} context
   * @param {Number} count
   * @return {Array}
   */
  updateComponentsGridColumnCount: (context, count) => {
    context.state.layout.componentsGridColumnCount = count;
    return ['layout'];
  }
};
