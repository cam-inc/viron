import constants from '../../core/constants';
import swagger from '../../swagger'

export default {
  show: function (context, obj) {
    context.state.page = obj;
    return [constants.CHANGE_PAGE];
  },
};
