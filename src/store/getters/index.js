import application from './application';
import modal from './modal';
import page from './page';

const constants = {
  MODAL_ALL: 'MODAL_ALL',
  PAGE_ALL: 'PAGE_ALL',
  PAGE_NAME: 'PAGE_NAME',
  PAGE_ROUTE: 'PAGE_ROUTE'
};

export default {
  [constants.MODAL_ALL]: modal.all,
  [constants.PAGE_ALL]: page.all,
  [constants.PAGE_NAME]: page.name,
  [constants.PAGE_ROUTE]: page.route
};

export {
  constants
};
