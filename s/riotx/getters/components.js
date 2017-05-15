export default {
  one: (context, riotID) => {
    return context.state.components[riotID];
  }
};
