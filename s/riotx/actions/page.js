import { find } from 'mout/object';
import constants from '../../core/constants';

export default {
  get: (context, id) => {
    return Promise
      .resolve()
      .then(() => {
        const page = find(context.state.dmc.pages, v => {
          return v.id.get() === id;
        });
        context.commit(constants.MUTATION_PAGE, page);
      });
  },

  remove: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_PAGE, null);
      });
  }
};
