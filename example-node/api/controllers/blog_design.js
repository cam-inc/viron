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

module.exports = {
  'blog_design#list': list,
};
