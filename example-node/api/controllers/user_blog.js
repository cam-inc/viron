
const pager = require('../../lib/pager');
const shared = require('../../shared');

/**
 * Controller : List User Blog
 * HTTP Method : GET
 * PATH : /userblog
 *
 * @param User Sequelize.model
 * @returns {function(*, *, *)}
 */

const list = (req, res) => {
  const store = shared.context.getStoreMain();
  const UserBlogs = store.models.UserBlogs;
  const attributes = Object.keys(req.swagger.operation.responses['200'].schema.items.properties);
  const limit = req.query.limit;
  const offset = req.query.offset;
  return Promise.resolve()
    .then(() => {
      return UserBlogs.count();
    })
    .then(count => {
      pager.setResHeader(res, limit, offset, count);
      const options = {
        attributes,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      };
      console.log(options)
      return UserBlogs.findAll(options);
    })
    .then(list => {
      res.json(list);
    })
    ;
};

module.exports = {
  'user_blog#list': list,
};
