import storage from 'store';
import constants from '../../core/constants';

export default {
  update: function (context, key) {
    context.state.current = storage.set(constants.STORAGE_CURRENT, key);
    return [constants.CHANGE_CURRENT];
  },
  remove: function (context) {
    context.state.current = storage.remove(constants.STORAGE_CURRENT);
    return [constants.CHANGE_CURRENT];
  }
}
