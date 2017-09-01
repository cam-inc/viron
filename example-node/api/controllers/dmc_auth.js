const shared = require('../../shared');
const vironlib = shared.context.getVironLib();

/**
 * DMCがデフォルトで提供している認証 (Google OAuth or EMail on JWT)
 * @type {{dmc_auth#signin: (function(*, *, *)), dmc_auth#signout: (function(*, *, *)), dmc_auth#googlesignin: (function(*, *, *)), dmc_auth#googleoauth2callback}}
 */
module.exports = {
  'dmc_auth#signin': vironlib.auth.controller.signIn,
  'dmc_auth#signout': vironlib.auth.controller.signOut,
  'dmc_auth#googlesignin': vironlib.auth.controller.googleSignIn,
  'dmc_auth#googleoauth2callback': vironlib.auth.controller.googleOAuth2Callback,
};
