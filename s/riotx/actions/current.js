import constants from '../../core/constants';

export default {
  update: (context, key) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_CURRENT_UPDATE, key);
      });
  },
  remove: (context) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_CURRENT_REMOVE);
      });
  },
};
