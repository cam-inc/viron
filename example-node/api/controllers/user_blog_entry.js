const pager = require('../../lib/pager');
const storeHelper = require('../../lib/stores').helper;

const shared = require('../../shared');

/**
 * Controller : List User Blog Entry
 * HTTP Method : GET
 * PATH : /userblogentry
 *
 * @returns {Promise.<TResult>}
 */
const list = (req, res) => {
  const store = shared.context.getStoreMain();
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
  ;
};

/**
 * Controller : Create  User Blog Entry
 * HTTP Method : POST
 * PATH : /userblogentry
 *
 * @returns {Promise.<TResult>}
 */
const create = (req, res) => {
  const store = shared.context.getStoreMain();
  const UserBlogEntries = store.models.UserBlogEntries;
  return storeHelper.create(store, UserBlogEntries, req.body)
    .then(data => {
      res.json(data);
    })
  ;
};

/**
 * Controller : Delete  User Blog Entry
 * HTTP Method : DELETE
 * PATH : /userblogentry/:id
 *
 * @returns {Promise.<TResult>}
 */
const remove = (req, res) => {
  const store = shared.context.getStoreMain();
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
  ;
};

/**
 * Controller : Show  User Blog Entry
 * HTTP Method : GET
 * PATH : /userblogentry/:id
 *
 * @returns {Promise.<TResult>}
 */
const show = (req, res) => {
  const store = shared.context.getStoreMain();
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
  ;
};

/**
 * Controller : update  User Blog Entry
 * HTTP Method : PUT
 * PATH : /userblogentry/:id
 *
 * @returns {Promise.<TResult>}
 */
const update = (req, res) => {
  const store = shared.context.getStoreMain();
  const UserBlogEntries = store.models.UserBlogEntries;
  const query = {
    id: req.swagger.params.id.value,
  };
  return storeHelper.update(store, UserBlogEntries, req.body, query)
    .then(data => {
      res.json(data);
    })
  ;
};

module.exports = {
  'user_blog_entry#list': list,
  'user_blog_entry#create': create,
  'user_blog_entry#remove': remove,
  'user_blog_entry#show': show,
  'user_blog_entry#update': update,
};
