import { constants as mutations } from '../mutations';

export default {
  /**
   * ページ情報を更新します。
   * @param {riotx.Context} context
   * @param {Object} obj
   * @return {Promise}
   */
  update: (context, obj) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.PAGE_ALL, obj);
      });
  }
};
