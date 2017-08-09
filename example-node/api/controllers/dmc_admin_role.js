const dmclib = require('node-dmclib');
const shared = require('../../shared');

module.exports = {
  'admin_role#list': dmclib.adminRole.controller.registerList(
    shared.context.getStoreMain().models.AdminRoles
  ),
  'admin_role#create': dmclib.adminRole.controller.registerCreate(
    shared.context.getStoreMain().models.AdminRoles,
    shared.context.getStoreMain().instance
  ),
  'admin_role#get': dmclib.adminRole.controller.registerGet(
    shared.context.getStoreMain().models.AdminRoles
  ),
  'admin_role#remove': dmclib.adminRole.controller.registerRemove(
    shared.context.getStoreMain().models.AdminRoles
  ),
  'admin_role#update': dmclib.adminRole.controller.registerUpdate(
    shared.context.getStoreMain().models.AdminRoles,
    shared.context.getStoreMain().instance
  ),
};
