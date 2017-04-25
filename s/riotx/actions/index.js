import constants from '../../core/constants';

import current from './current';
import endpoint from './endpoint';
import dmc from './dmc';
import page from './page';
import component from './component';

export default {
  [constants.ACTION_DMC_GET]: dmc.show,
  [constants.ACTION_DMC_REMOVE]: dmc.remove,

  [constants.ACTION_ENDPOINT_GET]: endpoint.show,
  [constants.ACTION_ENDPOINT_REMOVE]: endpoint.remove,
  [constants.ACTION_ENDPOINT_REMOVE_ALL]: endpoint.removeAll,

  [constants.ACTION_CURRENT_UPDATE]: current.update,
  [constants.ACTION_CURRENT_REMOVE]: current.remove,

  [constants.ACTION_PAGE_GET]: page.show,

  [constants.ACTION_COMPONENT_GET]: component.show,

};
