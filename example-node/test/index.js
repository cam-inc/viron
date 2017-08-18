const app = require('../app');

before(async() => {
  await new Promise(resolve => {
    app.on('setuped', () => {
      exports.app = app;
      resolve();
    });
  });
});
