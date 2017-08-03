const get = require('mout/object/get');
const helper = require('./helper');

const errors = require('../../errors');

/**
 * Middleware : Check Google OAuth token
 *
 * @returns {function(*, *, *)}
 */
module.exports = () => {
  return (req, res, next) => {
    if (!req.swagger.operation.security) {
      // 認証不要なリクエスト
      return next();
    }
    const token = get(req, 'auth.googleOAuthToken');
    if (!token) {
      // google認証を利用していないのでskip
      return next();
    }
    // tokenを使ってメアドが取得できれば有効
    helper.getMailAddress(token)
      .then(email => {
        if (!email) {
          return next(errors.frontend.Unauthorized());
        }
        next();
      })
      .catch(() => {
        return next(errors.frontend.Unauthorized());
      })
    ;
  };
};
