export default {
  opened: context => {
    return context.state.menu.isOpened;
  },

  enabled: context => {
    return context.state.menu.isEnabled;
  }
};
