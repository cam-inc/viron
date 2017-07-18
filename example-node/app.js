const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
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

  let port = process.env.PORT;
  if (2 <= swaggerExpress.runner.swagger.host.split(':').length) {
    port = swaggerExpress.runner.swagger.host.split(':')[1];
  }

  app.listen(port);

  console.log(`Added Paths: ${Object.keys(swaggerExpress.runner.swagger.paths)}`);
});
