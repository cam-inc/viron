const CHANGE_COMPONENTS_PREFIX = 'components_';

export default {
  SECTION_DASHBOARD: 'dashboard',
  SECTION_MANAGE: 'manage',

  // store.js
  STORAGE_CURRENT: 'current',
  STORAGE_ENDPOINTS: 'endpoints',
  STORAGE_TOAST: 'toast',
  STORAGE_OAUTH_ENDPOINT_KEY: 'oauth_endpoint_key',

  // Component#Style
  STYLE_NUMBER: 'number',
  STYLE_TABLE: 'table',
  STYLE_GRAPH_BAR: 'graph-bar',

  // Auth type
  AUTH_TYPE_EMAIL: 'email',
  AUTH_TYPE_OAUTH: 'oauth',

  // DMC's special constants
  DMC_TABLE_ACTION_KEY: 'dmc_table_action_key',

  // riotx#actions
  ACTION_LOCATION_SET: 'action_location_set',

  ACTION_DRAWER_TOGGLE: 'drawer_toggle',
  ACTION_DRAWER_OPEN: 'drawer_open',
  ACTION_DRAWER_CLOSE: 'drawer_close',
  ACTION_DRAWER_ENABLE: 'drawer_enable',
  ACTION_DRAWER_DISABLE: 'drawer_disable',

  ACTION_DMC_GET: 'dmc_get',
  ACTION_DMC_REMOVE: 'dmc_remove',

  ACTION_ENDPOINTS_GET: 'endpoints_get',
  ACTION_ENDPOINTS_REMOVE: 'endpoints_remove',
  ACTION_ENDPOINTS_REMOVE_ALL: 'endpoints_remove_all',
  ACTION_ENDPOINTS_ADD: 'endpoints_add',

  ACTION_CURRENT_UPDATE: 'current_update',
  ACTION_CURRENT_REMOVE: 'current_remove',

  ACTION_OAUTHENDPOINTKEY_UPDATE: 'oauthendpointkey_update',
  ACTION_OAUTHENDPOINTKEY_REMOVE: 'oauthendpointkey_remove',

  ACTION_PAGE_GET: 'page_get',
  ACTION_PAGE_REMOVE: 'page_remove',

  ACTION_COMPONENTS_GET: 'components_get',
  ACTION_COMPONENTS_OPERATE: 'components_operate',
  ACTION_COMPONENTS_REMOVE_ALL: 'components_remove_all',

  ACTION_TOAST_SHOW: 'toast_show',
  ACTION_TOAST_HIDE: 'toast_hide',
  ACTION_TOAST_RESET: 'toast_reset',

  ACTION_MODAL_SHOW: 'modal_show',
  ACTION_MODAL_HIDE: 'modal_hide',

  ACTION_AUTH_UPDATE: 'auth_update',
  ACTION_AUTH_VALIDATE: 'auth_validate',
  ACTION_AUTH_SIGN_IN_OAUTH: 'auth_sign_in_oauth',
  ACTION_AUTH_SIGN_IN_EMAIL: 'auth_sign_in_email',
  ACTION_AUTHTYPE_GET: 'authtype_get',
  ACTION_AUTH_SIGN_IN_SHOW: 'auth_sign_in_show',

  QUERYSTRING_KEY_TOKEN: 'token',

  // riotx#mutations
  MUTATION_LOCATION: 'location',

  MUTATION_DRAWER_TOGGLE: 'drawer_toggle',
  MUTATION_DRAWER_OPEN: 'drawer_open',
  MUTATION_DRAWER_CLOSE: 'drawer_close',
  MUTATION_DRAWER_ENABLE: 'drawer_enable',
  MUTATION_DRAWER_DISABLE: 'drawer_disable',

  MUTATION_DMC: 'dmc',
  MUTATION_DMC_REMOVE: 'dmc_remove',

  MUTATION_ENDPOINTS: 'endpoints',
  MUTATION_ENDPOINTS_REMOVE: 'endpoints_remove',
  MUTATION_ENDPOINTS_REMOVE_ALL: 'endpoints_remove_all',
  MUTATION_ENDPOINTS_ADD: "endpoints_add",
  MUTATION_ENDPOINTS_UPDATE: "endpoints_update",
  MUTATION_ENDPOINTS_TOKEN_UPDATE: 'endpoints_token_update',

  MUTATION_CURRENT: 'current',

  MUTATION_OAUTHENDPOINTKEY: 'oauthendpointkey',

  MUTATION_PAGE: 'page',

  MUTATION_COMPONENTS_ONE: 'components_one',
  MUTATION_COMPONENTS_REMOVE_ALL: 'components_remove_all',

  MUTATION_TOAST_ADD: 'toast_add',
  MUTATION_TOAST_REMOVE: 'toast_remove',

  MUTATION_MODAL_ADD: 'modal_add',
  MUTATION_MODAL_REMOVE: 'modal_remove',

  MUTATION_AUTH_SIGN_IN_SHOW: 'auth_sign_in_show',

  // riotx#getters
  GETTER_LOCATION: 'location',
  GETTER_LOCATION_TAG: 'location_tag',
  GETTER_LOCATION_DMCPAGE: 'location_dmcpage',

  GETTER_DRAWER_OPENED: 'drawer_opened',
  GETTER_DRAWER_ENABLED: 'drawer_enabled',

  GETTER_DMC: 'dmc',
  GETTER_DMC_PAGES: 'dmc_pages',
  GETTER_DMC_NAME: 'dmc_name',
  GETTER_DMC_DASHBOARD: 'dmc_dashboard',
  GETTER_DMC_MANAGE: 'dmc_manage',

  GETTER_CURRENT: 'current',

  GETTER_OAUTHENDPOINTKEY: 'oauthendpointkey',

  GETTER_PAGE: 'page',
  GETTER_PAGE_NAME: 'page_name',
  GETTER_PAGE_COMPONENTS: 'page_components',

  GETTER_COMPONENTS_ONE: 'components_one',

  GETTER_TOAST_LIST: 'toast_list',

  GETTER_MODAL_LIST: 'modal_list',

  GETTER_ENDPOINTS: 'endpoints',
  GETTER_ENDPOINTS_ONE: 'endpoints_one',
  GETTER_ENDPOINTS_NEXT_KEY: 'endpoints_next_key',

  GETTER_AUTH_SIGN_IN_SHOW_KEY: 'auth_sign_in_show_key',

  // riotx#mutated
  CHANGE_LOCATION: 'location',

  CHANGE_DRAWER: 'drawer',

  CHANGE_DMC: 'dmc',

  CHANGE_ENDPOINTS: 'endpoints',

  CHANGE_CURRENT: 'current',

  CHANGE_OAUTHENDPOINTKEY: 'oauthendpointkey',

  CHANGE_PAGE: 'page',

  CHANGE_SIGN_IN: 'sign_in',

  CHANGE_COMPONENTS: 'components',
  changeComponentsName: name => {
    return CHANGE_COMPONENTS_PREFIX + name;
  },

  CHANGE_TOAST: 'toast',

  CHANGE_MODAL: 'modal'
};
