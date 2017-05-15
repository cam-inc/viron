import constants from '../../core/constants';

export default {
  _: function (context, tag, dmcPage) {
    context.state.location.tag = tag;
    context.state.location.dmcPage = dmcPage;
    return [constants.CHANGE_LOCATION];
  }
};
