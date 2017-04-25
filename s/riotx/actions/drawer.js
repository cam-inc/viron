import constants from '../../core/constants';

export default {
  toggle: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_DRAWER_TOGGLE);
      });
  },

  close: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_DRAWER_CLOSE);
      });
  }
};
