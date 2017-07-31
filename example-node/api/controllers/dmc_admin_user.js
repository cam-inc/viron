const lib = require('../../lib');
const shared = require('../../shared');

module.exports = {
  'admin_user#list': lib.adminUser.controller.list(
    shared.context.getStoreMain().models.AdminUsers
  ),
  'admin_user#create': lib.adminUser.controller.create(
    shared.context.getStoreMain().models.AdminUsers,
    shared.context.getDefaultRole()
  ),
  'admin_user#get': lib.adminUser.controller.get(
    shared.context.getStoreMain().models.AdminUsers
  ),
  'admin_user#remove': lib.adminUser.controller.remove(
    shared.context.getStoreMain().models.AdminUsers
  ),
  'admin_user#update': lib.adminUser.controller.update(
    shared.context.getStoreMain().models.AdminUsers
  ),
};
