import { constants as mutations } from '../mutations';

export default {
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
        context.commit(mutations.LAYOUT_SIZE, width, height);
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
        context.commit(mutations.LAYOUT_COMPONENTS_GRID_COLUMN_COUNT, count);
      });
  }
};
