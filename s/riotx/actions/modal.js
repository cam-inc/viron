import constants from '../../core/constants';

export default {
  show: (context, tagName, tagOpts, modalOpts) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_MODAL_ADD, tagName, tagOpts, modalOpts);
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
