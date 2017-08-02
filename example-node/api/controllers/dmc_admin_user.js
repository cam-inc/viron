const lib = require('../../lib');
const shared = require('../../shared');

module.exports = {
  'admin_user#list': lib.adminUser.controller.registerList(
    shared.context.getStoreMain().models.AdminUsers
  ),
  'admin_user#create': lib.adminUser.controller.registerCreate(
    shared.context.getStoreMain().models.AdminUsers,
    shared.context.getDefaultRole()
  ),
  'admin_user#get': lib.adminUser.controller.registerGet(
    shared.context.getStoreMain().models.AdminUsers
  ),
  'admin_user#remove': lib.adminUser.controller.registerRemove(
    shared.context.getStoreMain().models.AdminUsers
  ),
  'admin_user#update': lib.adminUser.controller.registerUpdate(
    shared.context.getStoreMain().models.AdminUsers
  ),
};
