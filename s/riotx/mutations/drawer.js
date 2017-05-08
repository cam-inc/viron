import constants from '../../core/constants';

export default {
  toggle: context => {
    context.state.drawer.isOpened = !context.state.drawer.isOpened;
    return [constants.CHANGE_DRAWER];
  },

  open: context => {
    context.state.drawer.isOpened = true;
    return [constants.CHANGE_DRAWER];
  },

  close: context => {
    context.state.drawer.isOpened = false;
    return [constants.CHANGE_DRAWER];
  },

  enable: context => {
    context.state.drawer.isEnabled = true;
    return [constants.CHANGE_DRAWER];
  },

  disable: context => {
    context.state.drawer.isEnabled = false;
    return [constants.CHANGE_DRAWER];
  }
};
