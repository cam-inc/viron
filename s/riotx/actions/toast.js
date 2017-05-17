import constants from '../../core/constants';

export default {
  show: (context, obj) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_TOAST_ADD, obj);
      });
  },

  hide: (context, toastID) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_TOAST_REMOVE, toastID);
      });
  }

};
