export default {
  opened: context => {
    return context.state.drawer.isOpened;
  },

  enabled: context => {
    return context.state.drawer.isEnabled;
  }
};
