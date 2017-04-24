import constants from '../../core/constants';

export default {
  toggle: context => {
    context.state.drawer.opened = !context.state.drawer.opened;
    return [constants.CHANGE_DRAWER];
  }
};
