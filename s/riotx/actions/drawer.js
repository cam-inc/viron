import constants from '../../core/constants';

export default {
  show: (context, tagName, tagOpts, drawerOpts) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_DRAWER_ADD, tagName, tagOpts, drawerOpts);
      });
  },

  hide: (context, drawerID) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_DRAWER_REMOVE, drawerID);
      });
  }
};
