import { constants as mutations } from '../mutations';

export default {
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
