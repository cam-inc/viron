import constants from '../../core/constants';

import current from './current';
import endpoint from './endpoint';
import dmc from './dmc';

export default {
  [constants.MUTATION_DMC_SHOW]: dmc.show,
  [constants.MUTATION_DMC_REMOVE]: dmc.remove,
  [constants.MUTATION_ENDPOINT_SHOW]: endpoint.show,
  [constants.MUTATION_CURRENT_UPDATE]: current.update
};
