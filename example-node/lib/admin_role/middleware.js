const get = require('mout/object/get');
const helper = require('./helper');


/**
 * Middleware : Check Admin Role
 *
 * @returns {function(*, *, *)}
 */
module.exports = () => {
  return (req, res, next) => {
    if (!req.swagger.operation.security) {
      // 認証不要なリクエスト
      return next();
    }

    const roles = get(req, 'auth.roles');
    if (!helper.canAccess(req.path, req.method, roles)) {
      return next(new Error('permission denied'));
    }
    next();
  };
};
