const shared = require('../shared');
const vironlib = shared.context.getVironLib();

module.exports = {
  'viron_auth#signin': vironlib.auth.controller.signIn,
  'viron_auth#signout': vironlib.auth.controller.signOut,
};
