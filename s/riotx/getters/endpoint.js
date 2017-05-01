export default {
  list: context => {
    return context.state.endpoint;
  },
  one: (context, url) => {
    return context.state.endpoint[url];
  }
};
