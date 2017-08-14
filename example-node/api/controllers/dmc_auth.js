const shared = require('../../shared');
const dmclib = shared.context.getDmcLib();

/**
 * DMCがデフォルトで提供している認証 (Google OAuth or EMail on JWT)
 * @type {{dmc_auth#signin: (function(*, *, *)), dmc_auth#signout: (function(*, *, *)), dmc_auth#googlesignin: (function(*, *, *)), dmc_auth#googleoauth2callback}}
 */
module.exports = {
  'dmc_auth#signin': dmclib.auth.controller.signIn,
  'dmc_auth#signout': dmclib.auth.controller.signOut,
  'dmc_auth#googlesignin': dmclib.auth.controller.googleSignIn,
  'dmc_auth#googleoauth2callback': dmclib.auth.controller.googleOAuth2Callback,
};
