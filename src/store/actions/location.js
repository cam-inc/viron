import { constants as mutations } from '../mutations';

export default {
  /**
   * 更新します。
   * @param {riotx.Context} context
   * @param {Object} obj
   * @return {Promise}
   */
  update: (context, obj) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.LOCATION, obj);
      });
  }
};
