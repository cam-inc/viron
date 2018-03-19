const shared = require('../shared');
const context = shared.context;

/**
 * Controller : List  User
 * HTTP Method : GET
 * PATH : /topic
 *
 * @returns {Promise.<TResult>}
 */
const list = (req, res) => {
  const vironlib = context.getVironLib();
  const pager = vironlib.pager;
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const Topics = store.models.Topics;
  const attributes = Object.keys(req.swagger.operation.responses['200'].schema.items.properties);
  const limit = Number(req.query.limit || 3);
  const offset = Number(req.query.offset);
  const options = {
    attributes,
    limit,
    offset,
  };
  const query = {};
  if (req.query.name) {
    query.name = {$like: `${req.query.name}%`};
  }
  return storeHelper.list(store, Topics, query, options)
    .then(data => {
      pager.setResHeader(res, limit, offset, data.count);
      res.json(data.list);
    })
  ;
};

/**
 * Controller : Create Topic
 * HTTP Method : POST
 * PATH : /topic
 *
 * @returns {Promise.<TResult>}
 */
const create = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const Topics = store.models.Topics;
  const topic = Object.assign({}, req.body);
  return storeHelper.create(store, Topics, topic)
    .then(data => {
      res.json(data);
    })
    .catch(next)
  ;
};

/**
 * Controller : Delete Topic
 * HTTP Method : DELETE
 * PATH : /topic/:id
 *
 * @returns {Promise.<TResult>}
 */
const remove = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const Topics = store.models.Topics;
  const query = {
    id: req.swagger.params.id.value,
  };
  const options = {
    force: true, // physical delete
  };
  return storeHelper.remove(store, Topics, query, options)
    .then(() => {
      res.status(204).end();
    })
    .catch(next)
  ;
};

/**
 * Controller : update Topic
 * HTTP Method : PUT
 * PATH : /topic/:id
 *
 * @returns {Promise.<TResult>}
 */
const update = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const Topics = store.models.Topics;
  const query = {
    id: req.swagger.params.id.value,
  };
  const topic = Object.assign({}, req.body);
  return storeHelper.update(store, Topics, query, topic)
    .then(data => {
      res.json(data);
    })
    .catch(next)
  ;
};

module.exports = {
  'topic#list': list,
  'topic#create': create,
  'topic#remove': remove,
  'topic#update': update,
};
