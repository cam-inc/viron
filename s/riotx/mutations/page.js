import constants from '../../core/constants';

export default {
  show: function (context, obj) {
    context.state.page = obj;
    return [constants.CHANGE_PAGE];
  },
};
