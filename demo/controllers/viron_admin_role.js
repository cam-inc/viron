const shared = require('../shared');
const vironlib = shared.context.getVironLib();

module.exports = {
  'admin_role#list': vironlib.adminRole.controller.list,
  'admin_role#create': vironlib.adminRole.controller.create,
  'admin_role#remove': vironlib.adminRole.controller.remove,
  'admin_role#update': vironlib.adminRole.controller.update,
};
