const shared = require('../../shared');
const dmclib = shared.context.getDmcLib();

module.exports = {
  'admin_role#list': dmclib.adminRole.controller.list,
  'admin_role#create': dmclib.adminRole.controller.create,
  'admin_role#get': dmclib.adminRole.controller.get,
  'admin_role#remove': dmclib.adminRole.controller.remove,
  'admin_role#update': dmclib.adminRole.controller.update,
};
