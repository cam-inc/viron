import { find } from 'mout/object';
import constants from '../../core/constants';

export default {
  get: (context, id) => {
    return new Promise((resolve) => {
      const page = find(context.state.dmc.pages, (v) => {
        return v.id.get() === id
      });
      resolve(page);

    }).then(res => {
      context.commit(constants.MUTATION_PAGE, res);
    });
  },
};
