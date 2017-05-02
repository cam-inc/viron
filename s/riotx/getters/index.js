import constants from '../../core/constants';

import drawer from './drawer';
import dmc from './dmc';
import current from './current';
import page from './page';
import toast from './toast';
import modal from './modal';
import endpoint from './endpoint';

export default {
  [constants.GETTER_DRAWER_OPENED]: drawer.opened,

  [constants.GETTER_DMC]: dmc.show,
  [constants.GETTER_DMC_PAGES]: dmc.pages,
  [constants.GETTER_DMC_NAME]: dmc.name,
  [constants.GETTER_DMC_DASHBOARD]: dmc.dashboard,
  [constants.GETTER_DMC_MANAGE]: dmc.manage,

  [constants.GETTER_CURRENT]: current.show,

  [constants.GETTER_PAGE_GET]: page.show,

  [constants.GETTER_TOAST_LIST]: toast.list,

  [constants.GETTER_MODAL_LIST]: modal.list,

  [constants.GETTER_ENDPOINT_LIST]: endpoint.list,
  [constants.GETTER_ENDPOINT_ONE]: endpoint.one,
  [constants.GETTER_ENDPOINT_NEXT_KEY]: endpoint.nextKey,

};
