import constants from '../../core/constants';

export default {
  set: (context, tag, dmcPage) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_LOCATION, `dmc-${tag}`, dmcPage);
      });
  }
};
