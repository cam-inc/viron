import constants from '../../core/constants';

export default {
  toggle: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_MENU_TOGGLE);
      });
  },

  open: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_MENU_OPEN);
      });
  },

  close: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_MENU_CLOSE);
      });
  },

  enable: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_MENU_ENABLE);
      });
  },

  disable: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_MENU_DISABLE);
      });
  }
};
