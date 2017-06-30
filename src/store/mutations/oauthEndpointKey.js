import storage from 'store';
import { constants as states } from '../states';

export default {
  /**
   * OAuth認証中のエンドポイントkeyを変更します。
   * @param {riotx.Context} context
   * @param {String|null} endpointKey
   * @return {Array}
   */
  all: (context, endpointKey) => {
    context.state.oauthEndpointKey = storage.set('oauth_endpoint_key', endpointKey);
    return [states.OAUTHENDPOINTKEY];
  }
};
