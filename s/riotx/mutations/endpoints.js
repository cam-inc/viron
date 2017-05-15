import storage from 'store';
import constants from '../../core/constants';

export default {
  show: function (context) {
    context.state.endpoints = storage.get(constants.STORAGE_ENDPOINTS, {});
    return [constants.CHANGE_ENDPOINTS];
  },

  removeAll: function (context) {
    context.state.endpoints = storage.set(constants.STORAGE_ENDPOINTS, {});
    return [constants.CHANGE_ENDPOINTS];
  },

  remove: function (context, key) {
    delete context.state.endpoints[key];
    storage.set(constants.STORAGE_ENDPOINTS, context.state.endpoints);
    return [constants.CHANGE_ENDPOINTS];
  },

  add: function (context, key, endpoint) {
    context.state.endpoints[key] = endpoint;
    storage.set(constants.STORAGE_ENDPOINTS, context.state.endpoints);
    return [constants.CHANGE_ENDPOINTS];
  },

  update: function (context, key, endpoint) {
    context.state.endpoints[key] = endpoint;
    storage.set(constants.STORAGE_ENDPOINTS, context.state.endpoints);
    return [constants.CHANGE_ENDPOINTS];
  },

  updateToken: function (context, key, token) {
    context.state.endpoints[key].token = token;
    storage.set(constants.STORAGE_ENDPOINTS, context.state.endpoints);
    return [constants.CHANGE_ENDPOINTS_TOKEN_ERROR];
  }
};
