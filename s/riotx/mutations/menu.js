import constants from '../../core/constants';

export default {
  toggle: context => {
    context.state.menu.isOpened = !context.state.menu.isOpened;
    return [constants.CHANGE_MENU];
  },

  open: context => {
    context.state.menu.isOpened = true;
    return [constants.CHANGE_MENU];
  },

  close: context => {
    context.state.menu.isOpened = false;
    return [constants.CHANGE_MENU];
  },

  enable: context => {
    context.state.menu.isEnabled = true;
    return [constants.CHANGE_MENU];
  },

  disable: context => {
    context.state.menu.isEnabled = false;
    return [constants.CHANGE_MENU];
  }
};
