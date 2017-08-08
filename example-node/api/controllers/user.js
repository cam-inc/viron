const pager = require('../../lib/pager');
const storeHelper = require('../../lib/stores').helper;

const shared = require('../../shared');

/**
 * Controller : List  User
 * HTTP Method : GET
 * PATH : /user
 *
 * @returns {Promise.<TResult>}
 */
const list = (req, res) => {
  const store = shared.context.getStoreMain();
  const Users = store.models.Users;
  const attributes = Object.keys(req.swagger.operation.responses['200'].schema.items.properties);
  const limit = req.query.limit;
  const offset = req.query.offset;
  const options = {
    attributes,
    limit,
    offset,
  };
  const query = {};
  if (req.swagger.params.name.value) {
    query.where = {name: {$like: `${req.swagger.params.name.value}%`}};
  }
  return storeHelper.list(store, Users, query, options)
    .then(data => {
      pager.setResHeader(res, limit, offset, data.count);
      res.json(data.list);
    })
  ;
};

/**
 * Controller : Create  User
 * HTTP Method : POST
 * PATH : /user
 *
 * @returns {Promise.<TResult>}
 */
const create = (req, res) => {
  const store = shared.context.getStoreMain();
  const Users = store.models.Users;
  return storeHelper.create(store, Users, req.body)
    .then(data => {
      res.json(data);
    })
  ;
};

/**
 * Controller : Delete  User
 * HTTP Method : DELETE
 * PATH : /user/:id
 *
 * @returns {Promise.<TResult>}
 */
const remove = (req, res) => {
  const store = shared.context.getStoreMain();
  const Users = store.models.Users;
  const query = {
    id: req.swagger.params.id.value,
  };
  const options = {
    force: true, // physical delete
  };
  return storeHelper.remove(store, Users, query, options)
    .then(() => {
      res.status(204).end();
    })
  ;
};

/**
 * Controller : Show  User
 * HTTP Method : GET
 * PATH : /user/:id
 *
 * @returns {Promise.<TResult>}
 */
const show = (req, res) => {
  const store = shared.context.getStoreMain();
  const Users = store.models.Users;
  const query = {
    id: req.swagger.params.id.value,
  };
  const options = {
    attributes: Object.keys(req.swagger.operation.responses['200'].schema.properties),
  };
  return storeHelper.findOne(store, Users, query, options)
    .then(data => {
      res.json(data);
    })
  ;
};

/**
 * Controller : update  User
 * HTTP Method : PUT
 * PATH : /user/:id
 *
 * @returns {Promise.<TResult>}
 */
const update = (req, res) => {
  const store = shared.context.getStoreMain();
  const Users = store.models.Users;
  const query = {
    id: req.swagger.params.id.value,
  };
  return storeHelper.update(store, Users, req.body, query)
    .then(data => {
      res.json(data);
    })
  ;
};


module.exports = {
  'user#list': list,
  'user#create': create,
  'user#remove': remove,
  'user#show': show,
  'user#update': update,
};
