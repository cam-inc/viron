import constants from '../../core/constants';

export default {
  /**
   * レイアウトタイプを返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  type: context => {
    return context.state.layout.type;
  },

  /**
   * レイアウトタイプがdesktopならtrueを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isDesktop: context => {
    return (context.state.layout.type === constants.layoutTypeDesktop);
  },

  /**
   * レイアウトタイプがmobileならtrueを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isMobile: context => {
    return (context.state.layout.type === constants.layoutTypeMobile);
  },

  /**
   * 表示サイズを返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  size: context => {
    return context.state.layout.size;
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
