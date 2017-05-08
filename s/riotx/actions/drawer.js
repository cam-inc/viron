import constants from '../../core/constants';

export default {
  toggle: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_DRAWER_TOGGLE);
      });
  },

  open: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_DRAWER_OPEN);
      });
  },

  close: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_DRAWER_CLOSE);
      });
  },

  enable: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_DRAWER_ENABLE);
      });
  },

  disable: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_DRAWER_DISABLE);
      });
  }
};
