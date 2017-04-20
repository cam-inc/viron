import store from 'store';
import constants from '../../core/constants';

export default {
  update: function (context, obj) {
    context.state.current = store.set(constants.STORAGE_CURRENT, obj);
  },
  remove: function (context) {
    context.state.current = store.remove(constants.STORAGE_CURRENT);
  }
}
