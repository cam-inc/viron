const CHANGE_COMPONENT_PREFIX = 'component_';

export default {
  SECTION_DASHBOARD: 'dashboard',
  SECTION_MANAGE: 'manage',

  // store.js
  STORAGE_CURRENT: 'current',
  STORAGE_ENDPOINT: 'endpoint',
  STORAGE_TOAST: 'toast',

  // Component#Style
  STYLE_NUMBER: 'number',
  STYLE_TABLE: 'table',

  // Auth type
  AUTH_TYPE_EMAIL: 'email',
  AUTH_TYPE_OAUTH: 'oauth',

  // riotx#actions
  ACTION_DRAWER_TOGGLE: 'drawer_toggle',
  ACTION_DRAWER_OPEN: 'drawer_open',
  ACTION_DRAWER_CLOSE: 'drawer_close',
  ACTION_DRAWER_ENABLE: 'drawer_enable',
  ACTION_DRAWER_DISABLE: 'drawer_disable',

  ACTION_DMC_GET: 'dmc_get',
  ACTION_DMC_REMOVE: 'dmc_remove',

  ACTION_ENDPOINT_GET: 'endpoint_get',
  ACTION_ENDPOINT_REMOVE: 'endpoint_remove',
  ACTION_ENDPOINT_REMOVE_ALL: 'endpoint_remove_all',
  ACTION_ENDPOINT_ADD: 'endpoint_add',

  ACTION_CURRENT_UPDATE: 'current_update',
  ACTION_CURRENT_REMOVE: 'current_remove',

  ACTION_PAGE_GET: 'page_get',

  ACTION_COMPONENT_GET: 'component_get',

  ACTION_TOAST_SHOW: 'toast_show',
  ACTION_TOAST_HIDE: 'toast_hide',
  ACTION_TOAST_RESET: 'toast_reset',

  ACTION_MODAL_SHOW: 'modal_show',
  ACTION_MODAL_HIDE: 'modal_hide',

  ACTION_AUTH_UPDATE: 'auth_update',
  ACTION_AUTH_VALIDATE: 'auth_validate',
  ACTION_AUTH_SIGN_IN_GOOGLE: 'auth_sign_in_google',
  ACTION_AUTH_SIGN_IN_EMAIL: 'auth_sign_in_email',
  ACTION_AUTHTYPE_GET: 'authtype_get',
  ACTION_AUTH_SIGN_IN_SHOW: 'auth_sign_in_show',

  QUERYSTRING_KEY_TOKEN: 'token',

  // riotx#mutations
  MUTATION_DRAWER_TOGGLE: 'drawer_toggle',
  MUTATION_DRAWER_OPEN: 'drawer_open',
  MUTATION_DRAWER_CLOSE: 'drawer_close',
  MUTATION_DRAWER_ENABLE: 'drawer_enable',
  MUTATION_DRAWER_DISABLE: 'drawer_disable',

  MUTATION_DMC: 'dmc',
  MUTATION_DMC_REMOVE: 'dmc_remove',

  MUTATION_ENDPOINT: 'endpoint',
  MUTATION_ENDPOINT_REMOVE: 'endpoint_remove',
  MUTATION_ENDPOINT_REMOVE_ALL: 'endpoint_remove_all',
  MUTATION_ENDPOINT_ADD: "endpoint_add",
  MUTATION_ENDPOINT_UPDATE: "endpoint_update",
  MUTATION_ENDPOINT_TOKEN_UPDATE: 'endpoint_token_update',

  MUTATION_CURRENT_UPDATE: 'current_update',
  MUTATION_CURRENT_REMOVE: 'current_remove',

  MUTATION_PAGE: 'page',

  MUTATION_COMPONENT_ONE: 'component_one',

  MUTATION_TOAST_ADD: 'toast_add',
  MUTATION_TOAST_REMOVE: 'toast_remove',

  MUTATION_MODAL_ADD: 'modal_add',
  MUTATION_MODAL_REMOVE: 'modal_remove',

  MUTATION_AUTH_SIGN_IN_SHOW: 'auth_sign_in_show',


  // riotx#getters
  GETTER_DRAWER_OPENED: 'drawer_opened',
  GETTER_DRAWER_ENABLED: 'drawer_enabled',

  GETTER_DMC: 'dmc',
  GETTER_DMC_PAGES: 'dmc_pages',
  GETTER_DMC_NAME: 'dmc_name',
  GETTER_DMC_DASHBOARD: 'dmc_dashboard',
  GETTER_DMC_MANAGE: 'dmc_manage',

  GETTER_CURRENT: 'current',

  GETTER_PAGE_GET: 'page_get',

  GETTER_TOAST_LIST: 'toast_list',

  GETTER_MODAL_LIST: 'modal_list',

  GETTER_ENDPOINT_LIST: 'endpoint_list',
  GETTER_ENDPOINT_ONE: 'endpoint_one',
  GETTER_ENDPOINT_NEXT_KEY: 'endpoint_next_key',

  // riotx#mutated
  CHANGE_DRAWER: 'drawer',

  CHANGE_DMC: 'dmc',

  CHANGE_ENDPOINT: 'endpoint',

  CHANGE_CURRENT: 'current',

  CHANGE_PAGE: 'page',

  CHANGE_ENDPOINT_TOKEN_ERROR: 'endpoint_token_error',


  CHANGE_SIGN_IN: 'sign_in',

  changeComponentName: name => {
    return CHANGE_COMPONENT_PREFIX + name;
  },

  CHANGE_TOAST: 'toast',

  CHANGE_MODAL: 'modal'
};
