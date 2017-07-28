const http = require('http');
const https = require('https');

const app = require('express')();
const SwaggerExpress = require('swagger-express-mw');

const lib = require('./lib');
const helperSwagger = require('./lib/swagger');
const shared = require('./shared');

const context = shared.context;

module.exports = app; // for testing

const config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: {
    /**
     * JWT middleware
     * @param {Request} req
     * @param {Object} def - security definition
     * @param {Array} scopes - security scopes
     * @param {function} next
     */
    jwt: (req, def, scopes, next) => {
      lib.auth.jwt.middleware(context.getConfigAuthJwt())(req, req.res, next);
    },
  },
};

context.init()
  .then(() => {
    SwaggerExpress.create(config, (err, swaggerExpress) => {
      if (err) {
        throw err;
      }

      // add middlewares here.
      app.use(lib.acl.middleware(context.getConfigAcl()));

      app.use((req, res, next) => {
        if (req.method === 'OPTIONS') {
          return res.status(200).end();
        }
        next();
      });

      app.use(lib.audit_log.middleware(context.getStoreMain().models.AuditLogs));

      // add routing
      swaggerExpress.register(app);

      // error handler
      app.use((err, req, res, next) => {
        res.status(err.statusCode || 500).json({error: err});
        next(err);
      });

      const port = helperSwagger.getPort(swaggerExpress, process.env.PORT);
      const ssl = context.getConfigSsl();
      if (ssl.use) {
        https.createServer(ssl, app).listen(port);
      } else {
        http.createServer(app).listen(port);
      }

      for (let path in swaggerExpress.runner.swagger.paths) {
        for (let method in swaggerExpress.runner.swagger.paths[path]) {
          console.log(`Added Route. ${method.toUpperCase()}: ${path}`);
        }
      }
    });
  })
;
