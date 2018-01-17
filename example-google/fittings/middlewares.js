const express = require('express');

const shared = require('../shared');
const vironlib = shared.context.getVironLib();

module.exports = (fittingDef, pipes) => {
  const middleware = express();
  middleware.use(
    // add swagger object
    vironlib.swagger.middleware(pipes),
    // audit log
    vironlib.auditLog.middleware(),
    // check google oauth token
    vironlib.auth.google.middleware(),
    // check admin role
    vironlib.adminRole.middleware(),
    // completion empty body
    vironlib.bodyCompletion.middleware()
  );

  return (ctx, next) => {
    middleware(ctx.request, ctx.response, next);
  };
};
