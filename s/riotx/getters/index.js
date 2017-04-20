import constants from '../../core/constants';

import dmc from './dmc';
import current from './current';

export default {
  [constants.GETTER_DMC_SHOW]: dmc.show,
  [constants.GETTER_DMC_PAGES]: dmc.pages,
  [constants.GETTER_DMC_NAME]: dmc.name,
  [constants.GETTER_DMC_DASHBOARD]: dmc.dashboard,
  [constants.GETTER_CURRENT_SHOW]: current.show,

};
