import constants from '../../core/constants';

import current from './current';
import endpoint from './endpoint';
import dmc from './dmc';

export default {
  [constants.ACTION_DMC_SHOW]: dmc.show,
  [constants.ACTION_DMC_REMOVE]: dmc.remove,
  [constants.ACTION_ENDPOINT_SHOW]: endpoint.show,
  [constants.ACTION_CURRENT_UPDATE]: current.update,
  [constants.ACTION_CURRENT_REMOVE]: current.remove,
};
