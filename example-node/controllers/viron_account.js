const shared = require('../shared');
const vironlib = shared.context.getVironLib();

module.exports = {
  'account#list': vironlib.account.controller.list,
  'account#get': vironlib.account.controller.get,
  'account#update': vironlib.account.controller.update,
};
