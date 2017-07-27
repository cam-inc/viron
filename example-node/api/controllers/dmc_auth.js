const lib = require('../../lib');
const shared = require('../../shared');

/**
 * DMCがデフォルトで提供している認証 (Google OAuth or EMail on JWT)
 * @type {{dmc_auth#signin: (function(*, *, *)), dmc_auth#signout: (function(*, *, *)), dmc_auth#googlesignin: (function(*, *, *)), dmc_auth#googleoauth2callback}}
 */
module.exports = {
  'dmc_auth#signin': lib.auth.controller.registerSignIn(
    shared.context.getStoreMain().models.AdminUsers,
    shared.context.getStoreMain().models.AdminRoles,
    shared.context.getSuperRole(),
    shared.context.getConfigAuthJwt()
  ),

  'dmc_auth#signout': lib.auth.controller.registerSignOut(),

  'dmc_auth#googlesignin': lib.auth.controller.registerGoogleSignIn(
    shared.context.getConfigGoogleOAuth()
  ),
  'dmc_auth#googleoauth2callback': lib.auth.controller.registerGoogleOAuth2Callback(
    shared.context.getStoreMain().models.AdminUsers,
    shared.context.getStoreMain().models.AdminRoles,
    shared.context.getConfigGoogleOAuth(),
    shared.context.getConfigAuthJwt()
  )

};
