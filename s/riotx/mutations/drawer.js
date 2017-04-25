import constants from '../../core/constants';

export default {
  toggle: context => {
    context.state.drawer.opened = !context.state.drawer.opened;
    return [constants.CHANGE_DRAWER];
  },

  close: context => {
    context.state.drawer.opened = false;
    return [constants.CHANGE_DRAWER];
  }
};
