const dmclib = require('node-dmclib');

module.exports = {
  'swagger#show': dmclib.swagger.controller.registerShow(),
};
