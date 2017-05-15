import storage from 'store';
import constants from '../../core/constants';

export default {
  _: function (context, key) {
    context.state.oauthEndpointKey = storage.set(constants.STORAGE_OAUTH_ENDPOINT_KEY, key);
    return [constants.CHANGE_OAUTHENDPOINTKEY];
  }
};
