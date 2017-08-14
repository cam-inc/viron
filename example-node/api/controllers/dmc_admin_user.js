const shared = require('../../shared');
const dmclib = shared.context.getDmcLib();

module.exports = {
  'admin_user#list': dmclib.adminUser.controller.list,
  'admin_user#create': dmclib.adminUser.controller.create,
  'admin_user#get': dmclib.adminUser.controller.get,
  'admin_user#remove': dmclib.adminUser.controller.remove,
  'admin_user#update': dmclib.adminUser.controller.update,
};
