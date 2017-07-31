const lib = require('../../lib');
const shared = require('../../shared');

module.exports = {
  'admin_role#list': lib.adminRole.controller.list(
    shared.context.getStoreMain().models.AdminRoles
  ),
  'admin_role#create': lib.adminRole.controller.create(
    shared.context.getStoreMain().models.AdminRoles,
    shared.context.getStoreMain().instance
  ),
  'admin_role#get': lib.adminRole.controller.get(
    shared.context.getStoreMain().models.AdminRoles
  ),
  'admin_role#remove': lib.adminRole.controller.remove(
    shared.context.getStoreMain().models.AdminRoles
  ),
  'admin_role#update': lib.adminRole.controller.update(
    shared.context.getStoreMain().models.AdminRoles,
    shared.context.getStoreMain().instance
  ),
};
