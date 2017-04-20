import constants from '../../core/constants';

import current from './current';
import endpoint from './endpoint';
import dmc from './dmc';

export default {
  [constants.MUTATION_DMC_SHOW]: dmc.show,
  [constants.MUTATION_DMC_REMOVE]: dmc.remove,

  [constants.MUTATION_ENDPOINT_SHOW]: endpoint.show,
  [constants.MUTATION_ENDPOINT_REMOVE]: endpoint.remove,
  [constants.MUTATION_ENDPOINT_REMOVE_ALL]: endpoint.removeAll,

  [constants.MUTATION_CURRENT_UPDATE]: current.update,
  [constants.MUTATION_CURRENT_REMOVE]: current.remove,
};
