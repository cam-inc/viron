const shared = require('../shared');
const context = shared.context;

/**
 * Controller : List User Blog Entry
 * HTTP Method : GET
 * PATH : /userblogentry
 *
 * @returns {Promise.<TResult>}
 */
const list = (req, res, next) => {
  const vironlib = context.getVironLib();
  const pager = vironlib.pager;
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const UserBlogEntries = store.models.UserBlogEntries;
  const limit = Number(req.query.limit);
  const offset = Number(req.query.offset);
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
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
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
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
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
 * Controller : update  User Blog Entry
 * HTTP Method : PUT
 * PATH : /userblogentry/:id
 *
 * @returns {Promise.<TResult>}
 */
const update = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
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

/**
 * Controller : get Preview URL
 * HTTP Method : GET
 * PATH : /userblogentry/:id/preview
 *
 * @returns {Promise.<TResult>}
 */
const preview = (req, res) => {
  res.send(`https://${context.getConfigHost()}/page/userblogentry${req.params.id}?token=xxxxx`);
};

module.exports = {
  'user_blog_entry#list': list,
  'user_blog_entry#create': create,
  'user_blog_entry#remove': remove,
  'user_blog_entry#update': update,
  'user_blog_entry#preview': preview,
};
