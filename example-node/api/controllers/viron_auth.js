const shared = require('../../shared');
const vironlib = shared.context.getVironLib();

/**
 * Vironがデフォルトで提供している認証 (Google OAuth or EMail on JWT)
 * @type {{viron_auth#signin: (function(*, *, *)), viron_auth#signout: (function(*, *, *)), viron_auth#googlesignin: (function(*, *, *)), viron_auth#googleoauth2callback}}
 */
module.exports = {
  'viron_auth#signin': vironlib.auth.controller.signIn,
  'viron_auth#signout': vironlib.auth.controller.signOut,
  'viron_auth#googlesignin': vironlib.auth.controller.googleSignIn,
  'viron_auth#googleoauth2callback': vironlib.auth.controller.googleOAuth2Callback,
};
