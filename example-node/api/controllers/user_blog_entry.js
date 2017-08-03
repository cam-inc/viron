
const pager = require('../../lib/pager');
const shared = require('../../shared');

/**
 * Controller : List User Blog Entry
 * HTTP Method : GET
 * PATH : /userblogentry
 *
 * @param UserBlogEntries Sequelize.model
 * @returns {function(*, *, *)}
 */

const list = (req, res) => {
  const store = shared.context.getStoreMain();
  const UserBlogEntries = store.models.UserBlogEntries;
  const attributes = Object.keys(req.swagger.operation.responses['200'].schema.items.properties);
  const limit = req.query.limit;
  const offset = req.query.offset;
  return Promise.resolve()
    .then(() => {
      return UserBlogEntries.count();
    })
    .then(count => {
      pager.setResHeader(res, limit, offset, count);
      const options = {
        attributes,
        limit,
        offset,
      };
      return UserBlogEntries.findAll(options);
    })
    .then(list => {
      res.json(list);
    })
    ;
};

module.exports = {
  'user_blog_entry#list': list,
};
