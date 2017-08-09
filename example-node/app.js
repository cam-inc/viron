const http = require('http');
const https = require('https');

const app = require('express')();
const SwaggerExpress = require('swagger-express-mw');
const dmclib = require('node-dmclib');

const helperSwagger = dmclib.swagger.helper;
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
      dmclib.auth.jwt.middleware(context.getConfigAuthJwt())(req, req.res, next);
    },
  },
};

context.init()
  .then(() => {
    SwaggerExpress.create(config, (err, swaggerExpress) => {
      if (err) {
        throw err;
      }

      // swagger.jsonを動的に書き換える
      helperSwagger.autoGenerate(swaggerExpress);

      // add middlewares here.
      // - JWT認証後のmiddlewareを追加したい場合は api/controllers/middlewares に追加

      // add acl response headers
      app.use(dmclib.acl.middleware(context.getConfigAcl()));

      app.use((req, res, next) => {
        if (req.method === 'OPTIONS') {
          return res.status(200).end();
        }
        next();
      });

      // add routing
      swaggerExpress.register(app);

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
