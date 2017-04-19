export default {
  show: () => {
    return Promise
      .resolve();
  },
  update: (mutate, key) => {
    return Promise
      .resolve()
      .then(() => {
        mutate('current_update', key);
      });
  }
};
