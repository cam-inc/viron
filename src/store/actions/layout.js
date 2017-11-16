import exporter from './exporter';

export default exporter('layout', {
  /**
   * アプリケーションの表示サイズを更新します。
   * @param {riotx.Context} context
   * @param {Number} width
   * @param {Number} height
   * @return {Promise}
   */
  updateSize: (context, width, height) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('layout.updateSize', width, height);
      });
  },

  /**
   * componentリストのgridレイアウトのcolumn数を更新します。
   * @param {riotx.Context} context
   * @param {Number} count
   * @return {Promise}
   */
  updateComponentsGridColumnCount: (context, count) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('layout.updateComponentsGridColumnCount', count);
      });
  }
});
