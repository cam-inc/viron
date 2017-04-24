import constants from '../../core/constants';

import drawer from './drawer';
import current from './current';
import endpoint from './endpoint';
import dmc from './dmc';
import page from './page';

export default {
  [constants.MUTATION_DRAWER_TOGGLE]: drawer.toggle,

  [constants.MUTATION_DMC]: dmc.show,
  [constants.MUTATION_DMC_REMOVE]: dmc.remove,

  [constants.MUTATION_ENDPOINT]: endpoint.show,
  [constants.MUTATION_ENDPOINT_REMOVE]: endpoint.remove,
  [constants.MUTATION_ENDPOINT_REMOVE_ALL]: endpoint.removeAll,

  [constants.MUTATION_CURRENT_UPDATE]: current.update,
  [constants.MUTATION_CURRENT_REMOVE]: current.remove,

  [constants.MUTATION_PAGE_GET]: page.show,
};
