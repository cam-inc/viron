const shared = require('../../shared');
const vironlib = shared.context.getVironLib();

const afterAuthMiddlewares = [
  // audit log
  vironlib.auditLog.middleware(),
  // check google oauth token
  vironlib.auth.google.middleware(),
  // check admin role
  vironlib.adminRole.middleware(),
  // completion empty body
  vironlib.bodyCompletion.middleware(),
];

/**
 * 渡されたmiddlewaresを逐次実行する
 *
 * @param {Array} middlewares - middleware functions
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const chain = (middlewares, req, res, next) => {
  const createNext = i => {
    return err => {
      if (err) {
        return next(err);
      }

      const nextIndex = i + 1;
      const nextMiddleware = middlewares[nextIndex] ?
        createNext(nextIndex) : next;
      middlewares[i](req, res, nextMiddleware);
    };
  };
  return createNext(0)();
};

module.exports = {
  /**
   * security handler後に実行されるmiddleware
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  afterAuth: (req, res, next) => {
    return chain(afterAuthMiddlewares, req, res, next);
  },
};
