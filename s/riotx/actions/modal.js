import constants from '../../core/constants';

export default {
  show: (context, obj) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_MODAL_ADD, obj);
      });
  },

  hide: (context, modalID) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_MODAL_REMOVE, modalID);
      });
  }
};
