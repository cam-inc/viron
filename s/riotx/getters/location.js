export default {
  _: context => {
    return context.state.location;
  },

  tag: context => {
    return context.state.location.tag;
  },

  dmcPage: context => {
    return context.state.location.dmcPage;
  }
};
