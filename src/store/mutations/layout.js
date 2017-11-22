import constants from '../../core/constants';
import exporter from './exporter';

export default exporter('layout', {
  /**
   * 表示サイズを更新します。
   * @param {Object} state
   * @param {Number} width
   * @param {Number} height
   */
  updateSize: (state, width, height) => {
    state.layout.size.width = width;
    state.layout.size.height = height;
    if (width > constants.layoutThreshold) {
      state.layout.type = constants.layoutTypeDesktop;
    } else {
      state.layout.type = constants.layoutTypeMobile;
    }
    return ['layout'];
  },

  /**
   * componentリストのgridレイアウトのcolumn数を更新します。
   * @param {Object} state
   * @param {Number} count
   * @return {Array}
   */
  updateComponentsGridColumnCount: (state, count) => {
    state.layout.componentsGridColumnCount = count;
    return ['layout'];
  }
});
