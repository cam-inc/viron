require('dotenv').config();

const http = require('http');
const https = require('https');

const app = require('express')();
const SwaggerExpress = require('swagger-express-mw');

const shared = require('./shared');
const context = shared.context;

module.exports = app; // for testing

context.init()
  .then(() => {
    const vironlib = context.getVironLib();
    const helperSwagger = vironlib.swagger.helper;
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
          vironlib.auth.jwt.middleware()(req, req.res, next);
        },
      },
    };

    return new Promise((resolve, reject) => {
      SwaggerExpress.create(config, (err, swaggerExpress) => {
        if (err) {
          return reject(err);
        }
        return resolve(swaggerExpress);
      });
    })
      .then(swaggerExpress => {
      // swagger.jsonを動的に書き換える
        return helperSwagger.autoGenerate(swaggerExpress, context.getStoreMain().models)
          .then(() => {
            return swaggerExpress;
          })
        ;
      })
      .then(swaggerExpress => {
        // add middlewares here.
        // - JWT認証後のmiddlewareを追加したい場合は api/controllers/middlewares に追加

        // ignore if-none-match header
        app.disable('etag');

        // add acl response headers
        app.use(vironlib.acl.middleware());

        app.use((req, res, next) => {
          if (req.method === 'OPTIONS') {
            return res.status(200).end();
          }
          next();
        });

        // add routing
        swaggerExpress.register(app);

        const port = process.env.PORT || helperSwagger.getPort(swaggerExpress, 3000);
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

        app.emit('setuped'); // for testing
      })
    ;
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
;
