const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const helperSwagger = require('./api/helpers/swagger');

module.exports = app; // for testing

const config = {
  appRoot: __dirname, // required config
};

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) {
    throw err;
  }

  // add middlewares here.

  // add routing
  swaggerExpress.register(app);

  // error handler
  app.use((err, req, res, next) => {
    res.status(500).json({error: err});
    next(err);
  });

  let port = helperSwagger.getPort(swaggerExpress, process.env.PORT);
  app.listen(port);

  console.log(`Added Paths: ${Object.keys(swaggerExpress.runner.swagger.paths)}`);
});
