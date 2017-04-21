import constants from '../../core/constants';

export default {
  show: function (context, obj) {
    context.state.dmc = obj;
    return [constants.CHANGE_DMC];
  },
  remove: function (context) {
    context.state.dmc = null;
    return [constants.CHANGE_DMC];
  }
};
