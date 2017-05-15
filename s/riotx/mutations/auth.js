import constants from '../../core/constants';

export default {
  signInShow: (context, key) => {
    context.state.signinShowKey = key;
    return [constants.CHANGE_SIGN_IN];
  }
};
