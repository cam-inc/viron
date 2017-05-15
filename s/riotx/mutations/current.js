import storage from 'store';
import constants from '../../core/constants';

export default {
  _: function (context, key) {
    context.state.current = storage.set(constants.STORAGE_CURRENT, key);
    return [constants.CHANGE_CURRENT];
  }
};
