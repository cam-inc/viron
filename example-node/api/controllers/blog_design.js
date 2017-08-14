const shared = require('../../shared');
const context = shared.context;

/**
 * Controller : List Blog Design
 * HTTP Method : GET
 * PATH : /blogdesign
 *
 * @returns {Promise.<TResult>}
 */
const list = (req, res) => {
  const dmclib = context.getDmcLib();
  const pager = dmclib.pager;
  const storeHelper = dmclib.stores.helper;
  const store = context.getStoreMain();
  const BlogDesigns = store.models.BlogDesigns;
  const limit = Number(req.query.limit);
  const offset = Number(req.query.offset);
  const options = {
    attributes: Object.keys(req.swagger.operation.responses['200'].schema.items.properties),
    limit,
    offset,
  };
  return storeHelper.list(store, BlogDesigns, {}, options)
    .then(data => {
      pager.setResHeader(res, limit, offset, data.count);
      res.json(data.list);
    })
  ;
};

/**
 * Controller : Create  Blog Design
 * HTTP Method : POST
 * PATH : /blogdesign
 *
 * @returns {Promise.<TResult>}
 */
const create = (req, res) => {
  const dmclib = context.getDmcLib();
  const storeHelper = dmclib.stores.helper;
  const store = context.getStoreMain();
  const BlogDesigns = store.models.BlogDesigns;
  return storeHelper.create(store, BlogDesigns, req.body)
    .then(data => {
      res.json(data);
    })
  ;
};

/**
 * Controller : Delete  Blog Design
 * HTTP Method : DELETE
 * PATH : /blogdesign/:id
 *
 * @returns {Promise.<TResult>}
 */
const remove = (req, res) => {
  const dmclib = context.getDmcLib();
  const storeHelper = dmclib.stores.helper;
  const store = context.getStoreMain();
  const BlogDesigns = store.models.BlogDesigns;
  const query = {
    id: req.swagger.params.id.value,
  };
  const options = {
    force: true, // physical delete
  };
  return storeHelper.remove(store, BlogDesigns, query, options)
    .then(() => {
      res.status(204).end();
    })
  ;
};

/**
 * Controller : Show  Blog Design
 * HTTP Method : GET
 * PATH : /blogdesign/:id
 *
 * @returns {Promise.<TResult>}
 */
const show = (req, res) => {
  const dmclib = context.getDmcLib();
  const storeHelper = dmclib.stores.helper;
  const store = context.getStoreMain();
  const BlogDesigns = store.models.BlogDesigns;
  const query = {
    id: req.swagger.params.id.value,
  };
  const options = {
    attributes: Object.keys(req.swagger.operation.responses['200'].schema.properties),
  };
  return storeHelper.findOne(store, BlogDesigns, query, options)
    .then(data => {
      res.json(data);
    })
  ;
};

/**
 * Controller : update  Blog Design
 * HTTP Method : PUT
 * PATH : /blogdesign/:id
 *
 * @returns {Promise.<TResult>}
 */
const update = (req, res) => {
  const dmclib = context.getDmcLib();
  const storeHelper = dmclib.stores.helper;
  const store = context.getStoreMain();
  const BlogDesigns = store.models.BlogDesigns;
  const query = {
    id: req.swagger.params.id.value,
  };
  return storeHelper.update(store, BlogDesigns, query, req.body)
    .then(data => {
      res.json(data);
    })
  ;
};

module.exports = {
  'blog_design#list': list,
  'blog_design#create': create,
  'blog_design#remove': remove,
  'blog_design#show': show,
  'blog_design#update': update,
};
