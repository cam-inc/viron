const shared = require('../shared');
const vironlib = shared.context.getVironLib();

module.exports = {
  'swagger#show': vironlib.swagger.controller.show,
};
