import storage from 'store';
import constants from '../../core/constants';

export default {
  show: function (context, obj) {
    context.state.endpoint = storage.set(constants.STORAGE_ENDPOINT, obj);
  },
  removeAll: function (context) {
    context.state.endpoint = storage.remove(constants.STORAGE_ENDPOINT);
    return ['endpoint_show'];
  },

  remove: function (context, key) {
    // TODO
    throw new Error('TODO not support.')
  }
};
