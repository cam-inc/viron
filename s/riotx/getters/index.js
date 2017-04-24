import constants from '../../core/constants';

import dmc from './dmc';
import current from './current';

export default {
  [constants.GETTER_DMC]: dmc.show,
  [constants.GETTER_DMC_PAGES]: dmc.pages,
  [constants.GETTER_DMC_NAME]: dmc.name,
  [constants.GETTER_DMC_DASHBOARD]: dmc.dashboard,
  [constants.GETTER_DMC_MANAGE]: dmc.manage,

  [constants.GETTER_CURRENT]: current.show,

};
