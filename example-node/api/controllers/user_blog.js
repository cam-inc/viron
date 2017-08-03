
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
      };
      return UserBlogs.findAll(options);
    })
    .then(list => {
      res.json(list);
    })
    ;
};

/**
 * Controller : Create  User Blog
 * HTTP Method : POST
 * PATH : /userblog
 *
 * @returns {function(*, *)}
 */

const create = (req, res) => {
  const store = shared.context.getStoreMain();
  const UserBlogs = store.models.UserBlogs;
  return Promise.resolve()
    .then(() => {
      var data = new Object();
      data.user_id = req.body.user_id;
      data.title = req.body.title;
      data.subtitle = req.body.subtitle;
      data.genre = req.body.genre;
      data.design_id = req.body.design_id;
      return UserBlogs.create(data);
    })
    .then(data => {
      res.json(data);
    })
    ;
}

module.exports = {
  'user_blog#list': list,
  'user_blog#create': create,
};
