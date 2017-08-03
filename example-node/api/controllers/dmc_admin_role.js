const lib = require('../../lib');
const shared = require('../../shared');

module.exports = {
  'admin_role#list': lib.adminRole.controller.registerList(
    shared.context.getStoreMain().models.AdminRoles
  ),
  'admin_role#create': lib.adminRole.controller.registerCreate(
    shared.context.getStoreMain().models.AdminRoles,
    shared.context.getStoreMain().instance
  ),
  'admin_role#get': lib.adminRole.controller.registerGet(
    shared.context.getStoreMain().models.AdminRoles
  ),
  'admin_role#remove': lib.adminRole.controller.registerRemove(
    shared.context.getStoreMain().models.AdminRoles
  ),
  'admin_role#update': lib.adminRole.controller.registerUpdate(
    shared.context.getStoreMain().models.AdminRoles,
    shared.context.getStoreMain().instance
  ),
};
