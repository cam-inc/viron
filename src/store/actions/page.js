import find from 'mout/object/find';
import { constants as mutations } from '../mutations';

export default {
  /**
   * ページ情報を取得します。
   * @param {riotx.Context} context
   * @param {String} pageId
   * @return {Promise}
   */
  get: (context, pageId) => {
    return Promise
      .resolve()
      .then(() => {
        const pages = context.state.dmc.getValue('pages').getValue();
        const page = find(pages, v => {
          return (v.getValue('id').getValue() === pageId);
        });
        context.commit(mutations.PAGE, page);
      });
  },

  /**
   * ページ情報を削除します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  remove: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.PAGE, null);
      });
  }
};
