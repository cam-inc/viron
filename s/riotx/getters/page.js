export default {
  _: context => {
    return context.state.page;
  },

  name: context => {
    if (!context.state.page) {
      return '';
    }
    return context.state.page.name.get();
  },

  components: context => {
    if (!context.state.page) {
      return [];
    }
    return context.state.page.components;
  }
};
