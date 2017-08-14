const shared = require('../../shared');
const dmclib = shared.context.getDmcLib();

module.exports = {
  'swagger#show': dmclib.swagger.controller.show,
};
