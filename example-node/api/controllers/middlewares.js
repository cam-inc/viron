const dmclib = require('node-dmclib');
const shared = require('../../shared');

const context = shared.context;

const afterAuthMiddlewares = [
  // audit log
  dmclib.auditLog.middleware(context.getStoreMain().models.AuditLogs),
  // check google oauth token
  dmclib.auth.google.middleware(),
  // check admin role
  dmclib.adminRole.middleware(),
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
