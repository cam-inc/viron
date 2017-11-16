import find from 'mout/object/find';
import exporter from './exporter';

export default exporter('page', {
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
        context.commit('page.all', page);
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
        context.commit('page.all', null);
      });
  }
});
