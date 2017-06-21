import { constants as mutations } from '../mutations';

export default {
  /**
   * OAuth認証用のエンドポイントkeyを削除します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  remove: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.OAUTH_ENDPOINT_KEY, null);
      });
  }
};
