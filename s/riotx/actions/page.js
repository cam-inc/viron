import { find } from 'mout/object';
import constants from '../../core/constants';

export default {
  show: (context, id) => {
    return new Promise((resolve) => {
      const page = find(context.state.dmc.pages, (v) => {
        return v.id.get() === id
      });
      resolve(page);

    }).then(res => {
      context.commit(constants.MUTATION_PAGE_GET, res);
    });
  },
};
