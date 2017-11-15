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
        const pages = context.getter('viron.pages');
        const page = find(pages, page => {
          return (page.id === pageId);
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
