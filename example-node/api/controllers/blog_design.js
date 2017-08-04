const pager = require('../../lib/pager');
const shared = require('../../shared');

/**
 * Controller : List Blog Design
 * HTTP Method : GET
 * PATH : /blogdesign
 *
 * @returns {function(*, *, *)}
 */

const list = (req, res) => {
  const store = shared.context.getStoreMain();
  const BlogDesigns = store.models.BlogDesigns;
  const attributes = Object.keys(req.swagger.operation.responses['200'].schema.items.properties);
  const limit = req.query.limit;
  const offset = req.query.offset;
  return Promise.resolve()
    .then(() => {
      return BlogDesigns.count();
    })
    .then(count => {
      pager.setResHeader(res, limit, offset, count);
      const options = {
        attributes,
        limit,
        offset,
      };
      return BlogDesigns.findAll(options);
    })
    .then(list => {
      res.json(list);
    })
    ;
};

/**
 * Controller : Create  Blog Design
 * HTTP Method : POST
 * PATH : /blogdesign
 *
 * @returns {function(*, *)}
 */

const create = (req, res) => {
  const store = shared.context.getStoreMain();
  const BlogDesigns = store.models.BlogDesigns;
  return Promise.resolve()
    .then(() => {
      var data = new Object();
      data.id = req.body.id;
      data.name = req.body.name;
      data.background_image = req.body.background_image;
      data.base_color = req.body.base_color;
      return BlogDesigns.create(data);
    })
    .then(data => {
      res.json(data);
    })
    ;
}

/**
 * Controller : Delete  Blog Design
 * HTTP Method : DELETE
 * PATH : /blogdesign/:id
 *
 * @returns {function(*)}
 */

const remove = (req, res) => {
  const store = shared.context.getStoreMain();
  const BlogDesigns = store.models.BlogDesigns;
  const id = req.swagger.params.id.value;
  return BlogDesigns.destroy({where: {id}, force: true})
    .then(() => {
      res.status(204).end();
    })
    ;
}

/**
 * Controller : Show  Blog Design
 * HTTP Method : GET
 * PATH : /blogdesign/:id
 *
 * @returns {function(*)}
 */

const show = (req, res) => {
  const store = shared.context.getStoreMain();
  const BlogDesigns = store.models.BlogDesigns;
  const attributes = Object.keys(req.swagger.operation.responses['200'].schema.properties);
  const id = req.swagger.params.id.value;
  BlogDesigns.findById(id, {attributes})
    .then(data => {
      res.json(data);
    })
  ;
}

/**
 * Controller : update  Blog Design
 * HTTP Method : PUT
 * PATH : /blogdesign/:id
 *
 * @returns {function(*, *)}
 */

const update = (req, res) => {
  const store = shared.context.getStoreMain();
  const BlogDesigns = store.models.BlogDesigns;
  return Promise.resolve()
    .then(() => {
      var data = new Object();
      data.id = req.body.id;
      data.name = req.body.name;
      data.background_image = req.body.background_image;
      data.base_color = req.body.base_color;
      const id = req.swagger.params.id.value;
      return BlogDesigns.update(data, {where: {id}});
    })
    .then(data => {
      res.json(data);
    })
    ;
}

module.exports = {
  'blog_design#list': list,
  'blog_design#create': create,
  'blog_design#remove': remove,
  'blog_design#show': show,
  'blog_design#update': update,
};
