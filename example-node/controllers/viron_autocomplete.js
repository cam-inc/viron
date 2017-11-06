const shared = require('../shared');
const vironlib = shared.context.getVironLib();

module.exports = {
  'viron_autocomplete#list': vironlib.autocomplete.controller.list,
};
