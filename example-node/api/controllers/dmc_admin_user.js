const dmclib = require('node-dmclib');
const shared = require('../../shared');

module.exports = {
  'admin_user#list': dmclib.adminUser.controller.registerList(
    shared.context.getStoreMain().models.AdminUsers
  ),
  'admin_user#create': dmclib.adminUser.controller.registerCreate(
    shared.context.getStoreMain().models.AdminUsers,
    shared.context.getDefaultRole()
  ),
  'admin_user#get': dmclib.adminUser.controller.registerGet(
    shared.context.getStoreMain().models.AdminUsers
  ),
  'admin_user#remove': dmclib.adminUser.controller.registerRemove(
    shared.context.getStoreMain().models.AdminUsers
  ),
  'admin_user#update': dmclib.adminUser.controller.registerUpdate(
    shared.context.getStoreMain().models.AdminUsers
  ),
};
