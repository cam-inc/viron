import { constants as mutations } from '../mutations';

export default {
  /**
   * 選択中endpointKeyを更新します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @return {Promise}
   */
  update: (context, endpointKey) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.CURRENT, endpointKey);
      });
  },

  /**
   * 選択中endpointKeyを削除します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  remove: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.CURRENT, null);
      });
  }
};
