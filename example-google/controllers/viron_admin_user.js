const shared = require('../shared');
const vironlib = shared.context.getVironLib();

module.exports = {
  'admin_user#list': vironlib.adminUser.controller.list,
  'admin_user#create': vironlib.adminUser.controller.create,
  'admin_user#remove': vironlib.adminUser.controller.remove,
  'admin_user#update': vironlib.adminUser.controller.update,
};
