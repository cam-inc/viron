const {map} = require('mout/collection');

const shared = require('../shared');
const context = shared.context;

const show = (req, res) => {
  res.status(200).send('pong');
};

const deep = (req, res, next) => {
  const stores = context.getStores();
  const tasks = map(stores, v => {
    const ping = v.functions && v.functions.ping;
    if (!ping) {
      return Promise.resolve();
    }
    return ping(v.instance);
  });

  Promise.all(tasks)
    .then(() => {
      res.status(200).send('pong');
    })
    .catch(next);
};

module.exports = {
  'ping#show': show,
  'ping#deep': deep,
};
