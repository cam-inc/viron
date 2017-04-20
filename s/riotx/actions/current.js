export default {
  show: () => {
    return Promise
      .resolve();
  },
  update: (context, key) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('current_update', key);
      });
  }
};
