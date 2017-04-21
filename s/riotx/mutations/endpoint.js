import storage from 'store';
import constants from '../../core/constants';

export default {
  show: function (context, obj) {
    context.state.endpoint = storage.set(constants.STORAGE_ENDPOINT, obj);
    return [constants.CHANGE_ENDPOINT];
  },
  removeAll: function (context) {
    context.state.endpoint = storage.remove(constants.STORAGE_ENDPOINT);
    return [constants.CHANGE_ENDPOINT];
  },

  remove: function (context, key) {
    delete context.state.endpoint[key]
    context.state.endpoint = storage.set(constants.STORAGE_ENDPOINT, context.state.endpoint);
    return [constants.CHANGE_ENDPOINT];
  }
};
