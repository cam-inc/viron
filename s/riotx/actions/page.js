import { find } from 'mout/object';
import constants from '../../core/constants';

export default {
  get: (context, id) => {
    return Promise
      .resolve()
      .then(() => {
        const pages = context.state.dmc.getValue('pages').getValue();
        const page = find(pages, v => {
          return v.getValue('id').getValue() === id;
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
