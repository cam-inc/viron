const shared = require('../shared');
const context = shared.context;

/**
 * Controller : List User Blog
 * HTTP Method : GET
 * PATH : /userblog
 *
 * @returns {Promise.<TResult>}
 */
const list = (req, res, next) => {
  const vironlib = context.getVironLib();
  const pager = vironlib.pager;
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const UserBlogs = store.models.UserBlogs;
  const attributes = Object.keys(req.swagger.operation.responses['200'].schema.items.properties);
  const limit = Number(req.query.limit);
  const offset = Number(req.query.offset);
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
    .catch(next)
  ;
};

/**
 * Controller : Create  User Blog
 * HTTP Method : POST
 * PATH : /userblog
 *
 * @returns {Promise.<TResult>}
 */
const create = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const UserBlogs = store.models.UserBlogs;
  return storeHelper.create(store, UserBlogs, req.body)
    .then(data => {
      res.json(data);
    })
    .catch(next)
  ;
};

/**
 * Controller : Delete  User Blog
 * HTTP Method : DELETE
 * PATH : /userblog/:id
 *
 * @returns {Promise.<TResult>}
 */
const remove = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
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
    .catch(next)
  ;
};

/**
 * Controller : update  User Blog
 * HTTP Method : PUT
 * PATH : /userblog/:id
 *
 * @returns {Promise.<TResult>}
 */
const update = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const UserBlogs = store.models.UserBlogs;
  const query = {
    id: req.swagger.params.id.value,
  };
  return storeHelper.update(store, UserBlogs, query, req.body)
    .then(data => {
      res.json(data);
    })
    .catch(next)
  ;
};

module.exports = {
  'user_blog#list': list,
  'user_blog#create': create,
  'user_blog#remove': remove,
  'user_blog#update': update,
};
