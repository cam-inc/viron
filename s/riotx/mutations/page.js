import constants from '../../core/constants';

export default {
  _: function (context, page) {
    context.state.page = page;
    return [constants.CHANGE_PAGE];
  }
};
