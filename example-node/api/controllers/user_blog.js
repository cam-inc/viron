const pager = require('../../lib/pager');
const storeHelper = require('../../lib/stores').helper;

const shared = require('../../shared');

/**
 * Controller : List User Blog
 * HTTP Method : GET
 * PATH : /userblog
 *
 * @returns {Promise.<TResult>}
 */
const list = (req, res) => {
  const store = shared.context.getStoreMain();
  const UserBlogs = store.models.UserBlogs;
  const attributes = Object.keys(req.swagger.operation.responses['200'].schema.items.properties);
  const limit = req.query.limit;
  const offset = req.query.offset;
  const options = {
    attributes,
    limit,
    offset,
  };
  return storeHelper.list(store, UserBlogs, {}, options)
    .then(data => {
      pager.setResHeader(res, limit, offset, data.count);
      res.json(data.list);
    })
  ;
};

/**
 * Controller : Create  User Blog
 * HTTP Method : POST
 * PATH : /userblog
 *
 * @returns {Promise.<TResult>}
 */
const create = (req, res) => {
  const store = shared.context.getStoreMain();
  const UserBlogs = store.models.UserBlogs;
  return storeHelper.create(store, UserBlogs, req.body)
    .then(data => {
      res.json(data);
    })
  ;
};

/**
 * Controller : Delete  User Blog
 * HTTP Method : DELETE
 * PATH : /userblog/:id
 *
 * @returns {Promise.<TResult>}
 */
const remove = (req, res) => {
  const store = shared.context.getStoreMain();
  const UserBlogs = store.models.UserBlogs;
  const query = {
    id: req.swagger.params.id.value,
  };
  const options = {
    force: true, // physical delete
  };
  return storeHelper.remove(store, UserBlogs, query, options)
    .then(() => {
      res.status(204).end();
    })
  ;
};

/**
 * Controller : Show  User Blog
 * HTTP Method : GET
 * PATH : /userblog/:id
 *
 * @returns {Promise.<TResult>}
 */
const show = (req, res) => {
  const store = shared.context.getStoreMain();
  const UserBlogs = store.models.UserBlogs;
  const query = {
    id: req.swagger.params.id.value,
  };
  const options = {
    attributes: Object.keys(req.swagger.operation.responses['200'].schema.properties),
  };
  return storeHelper.findOne(store, UserBlogs, query, options)
    .then(data => {
      res.json(data);
    })
  ;
};

/**
 * Controller : update  User Blog
 * HTTP Method : PUT
 * PATH : /userblog/:id
 *
 * @returns {Promise.<TResult>}
 */
const update = (req, res) => {
  const store = shared.context.getStoreMain();
  const UserBlogs = store.models.UserBlogs;
  const query = {
    id: req.swagger.params.id.value,
  };
  return storeHelper.update(store, UserBlogs, req.body, query)
    .then(data => {
      res.json(data);
    })
  ;
};

module.exports = {
  'user_blog#list': list,
  'user_blog#create': create,
  'user_blog#remove': remove,
  'user_blog#show': show,
  'user_blog#update': update,
};
