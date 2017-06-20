import { constants as mutations } from '../mutations';

export default {
  /**
   * モーダルを追加します。
   * @param {riotx.Context} context
   * @param {String} tagName
   * @param {Object} tagOpts
   * @param {Object} modalOpts
   * @return {Promise}
   */
  add: (context, tagName, tagOpts, modalOpts) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.MODALS_ADD, tagName, tagOpts, modalOpts);
      });
  },

  /**
   * モーダルを削除します。
   * @param {riotx.Context} context
   * @param {String} modalId
   * @return {Promise}
   */
  remove: (context, modalId) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.MODALS_REMOVE, modalId);
      });
  }
};
