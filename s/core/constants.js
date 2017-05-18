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
  STYLE_GRAPH_SCATTERPLOT: 'graph-scatterplot',
  STYLE_GRAPH_LINE: 'graph-line',
  STYLE_GRAPH_HORIZONTAL_BAR: 'graph-horizontal-bar',
  STYLE_GRAPH_STACKED_BAR: 'graph-stacked-bar',
  STYLE_GRAPH_HORIZONTAL_STACKED_BAR: 'graph-horizontal-stacked-bar',
  STYLE_GRAPH_STACKED_AREA: 'graph-stacked-area',

  // Auth type
  AUTH_TYPE_EMAIL: 'email',
  AUTH_TYPE_OAUTH: 'oauth',

  // DMC's special constants
  DMC_TABLE_ACTION_KEY: 'dmc_table_action_key',

  // riotx#actions
  ACTION_LOCATION_SET: 'action_location_set',

  ACTION_MENU_TOGGLE: 'menu_toggle',
  ACTION_MENU_OPEN: 'menu_open',
  ACTION_MENU_CLOSE: 'menu_close',
  ACTION_MENU_ENABLE: 'menu_enable',
  ACTION_MENU_DISABLE: 'menu_disable',

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
  ACTION_COMPONENTS_REMOVE_ONE: 'components_remove_one',

  ACTION_TOAST_SHOW: 'toast_show',
  ACTION_TOAST_HIDE: 'toast_hide',
  ACTION_TOAST_RESET: 'toast_reset',

  ACTION_MODAL_SHOW: 'modal_show',
  ACTION_MODAL_HIDE: 'modal_hide',

  ACTION_AUTH_UPDATE: 'auth_update',
  ACTION_AUTH_REMOVE: 'auth_remove',
  ACTION_AUTH_VALIDATE: 'auth_validate',
  ACTION_AUTH_SIGN_IN_OAUTH: 'auth_sign_in_oauth',
  ACTION_AUTH_SIGN_IN_EMAIL: 'auth_sign_in_email',
  ACTION_AUTHTYPE_GET: 'authtype_get',
  ACTION_AUTH_SIGN_IN_SHOW: 'auth_sign_in_show',

  QUERYSTRING_KEY_TOKEN: 'token',

  // riotx#mutations
  MUTATION_LOCATION: 'location',

  MUTATION_MENU_TOGGLE: 'menu_toggle',
  MUTATION_MENU_OPEN: 'menu_open',
  MUTATION_MENU_CLOSE: 'menu_close',
  MUTATION_MENU_ENABLE: 'menu_enable',
  MUTATION_MENU_DISABLE: 'menu_disable',

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
  MUTATION_COMPONENTS_REMOVE_ONE: 'components_remove_one',

  MUTATION_TOAST_ADD: 'toast_add',
  MUTATION_TOAST_REMOVE: 'toast_remove',

  MUTATION_MODAL_ADD: 'modal_add',
  MUTATION_MODAL_REMOVE: 'modal_remove',

  MUTATION_AUTH_SIGN_IN_SHOW: 'auth_sign_in_show',

  // riotx#getters
  GETTER_LOCATION: 'location',
  GETTER_LOCATION_TAG: 'location_tag',
  GETTER_LOCATION_DMCPAGE: 'location_dmcpage',

  GETTER_MENU_OPENED: 'menu_opened',
  GETTER_MENU_ENABLED: 'menu_enabled',

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

  CHANGE_MENU: 'menu',

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
