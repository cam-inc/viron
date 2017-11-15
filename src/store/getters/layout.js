import constants from '../../core/constants';
import exporter from './exporter';

export default exporter('layout', {
  /**
   * レイアウトタイプを返します。
   * @param {Object} state
   * @return {String}
   */
  type: state => {
    return state.layout.type;
  },

  /**
   * レイアウトタイプがdesktopならtrueを返します。
   * @param {Object} state
   * @return {Boolean}
   */
  isDesktop: state => {
    return (state.layout.type === constants.layoutTypeDesktop);
  },

  /**
   * レイアウトタイプがmobileならtrueを返します。
   * @param {Object} state
   * @return {Boolean}
   */
  isMobile: state => {
    return (state.layout.type === constants.layoutTypeMobile);
  },

  /**
   * 表示サイズを返します。
   * @param {Object} state
   * @return {Object}
   */
  size: state => {
    return state.layout.size;
  },

  /**
   * componentリストのgridレイアウトのcolumn数を返します。
   * @param {Object} state
   * @return {Number}
   */
  componentsGridColumnCount: state => {
    return state.layout.componentsGridColumnCount;
  }
});
