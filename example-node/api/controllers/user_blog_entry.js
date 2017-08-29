const shared = require('../../shared');
const context = shared.context;

/**
 * Controller : List User Blog Entry
 * HTTP Method : GET
 * PATH : /userblogentry
 *
 * @returns {Promise.<TResult>}
 */
const list = (req, res, next) => {
  const dmclib = context.getDmcLib();
  const pager = dmclib.pager;
  const storeHelper = dmclib.stores.helper;
  const store = context.getStoreMain();
  const UserBlogEntries = store.models.UserBlogEntries;
  const limit = req.query.limit;
  const offset = req.query.offset;
  const options = {
    attributes: Object.keys(req.swagger.operation.responses['200'].schema.items.properties),
    limit,
    offset,
  };
  return storeHelper.list(store, UserBlogEntries, {}, options)
    .then(data => {
      pager.setResHeader(res, limit, offset, data.count);
      res.json(data.list);
    })
    .catch(next)
  ;
};

/**
 * Controller : Create  User Blog Entry
 * HTTP Method : POST
 * PATH : /userblogentry
 *
 * @returns {Promise.<TResult>}
 */
const create = (req, res, next) => {
  const dmclib = context.getDmcLib();
  const storeHelper = dmclib.stores.helper;
  const store = context.getStoreMain();
  const UserBlogEntries = store.models.UserBlogEntries;
  return storeHelper.create(store, UserBlogEntries, req.body)
    .then(data => {
      res.json(data);
    })
    .catch(next)
  ;
};

/**
 * Controller : Delete  User Blog Entry
 * HTTP Method : DELETE
 * PATH : /userblogentry/:id
 *
 * @returns {Promise.<TResult>}
 */
const remove = (req, res, next) => {
  const dmclib = context.getDmcLib();
  const storeHelper = dmclib.stores.helper;
  const store = context.getStoreMain();
  const UserBlogEntries = store.models.UserBlogEntries;
  const query = {
    id: req.swagger.params.id.value,
  };
  const options = {
    force: true, // physical delete
  };
  return storeHelper.remove(store, UserBlogEntries, query, options)
    .then(() => {
      res.status(204).end();
    })
    .catch(next)
  ;
};

/**
 * Controller : Show  User Blog Entry
 * HTTP Method : GET
 * PATH : /userblogentry/:id
 *
 * @returns {Promise.<TResult>}
 */
const show = (req, res, next) => {
  const dmclib = context.getDmcLib();
  const storeHelper = dmclib.stores.helper;
  const store = context.getStoreMain();
  const UserBlogEntries = store.models.UserBlogEntries;
  const query = {
    id: req.swagger.params.id.value,
  };
  const options = {
    attributes: Object.keys(req.swagger.operation.responses['200'].schema.properties),
  };
  return storeHelper.findOne(store, UserBlogEntries, query, options)
    .then(data => {
      res.json(data);
    })
    .catch(next)
  ;
};

/**
 * Controller : update  User Blog Entry
 * HTTP Method : PUT
 * PATH : /userblogentry/:id
 *
 * @returns {Promise.<TResult>}
 */
const update = (req, res, next) => {
  const dmclib = context.getDmcLib();
  const storeHelper = dmclib.stores.helper;
  const store = context.getStoreMain();
  const UserBlogEntries = store.models.UserBlogEntries;
  const query = {
    id: req.swagger.params.id.value,
  };
  return storeHelper.update(store, UserBlogEntries, query, req.body)
    .then(data => {
      res.json(data);
    })
    .catch(next)
  ;
};

module.exports = {
  'user_blog_entry#list': list,
  'user_blog_entry#create': create,
  'user_blog_entry#remove': remove,
  'user_blog_entry#show': show,
  'user_blog_entry#update': update,
};
