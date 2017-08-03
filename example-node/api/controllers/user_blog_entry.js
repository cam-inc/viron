
const pager = require('../../lib/pager');
const shared = require('../../shared');

/**
 * Controller : List User Blog Entry
 * HTTP Method : GET
 * PATH : /userblogentry
 *
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

/**
 * Controller : Create  User Blog Entry
 * HTTP Method : POST
 * PATH : /userblogentry
 *
 * @returns {function(*, *)}
 */

const create = (req, res) => {
  const store = shared.context.getStoreMain();
  const UserBlogEntries = store.models.UserBlogEntries;
  return Promise.resolve()
    .then(() => {
      var data = new Object();
      data.user_blog_id = req.body.user_blog_id;
      data.title = req.body.title;
      data.theme = req.body.theme;
      data.content = req.body.content;
      console.log(data)
      return UserBlogEntries.create(data);
    })
    .then(data => {
      res.json(data);
    })
    ;
}

/**
 * Controller : Delete  User Blog Entry
 * HTTP Method : DELETE
 * PATH : /userblogentry/:id
 *
 * @returns {function(*)}
 */

const remove = (req, res) => {
  const store = shared.context.getStoreMain();
  const UserBlogEntries = store.models.UserBlogEntries;
  const id = req.swagger.params.id.value;
  return UserBlogEntries.destroy({where: {id}, force: true})
    .then(() => {
      res.status(204).end();
    })
    ;
}

module.exports = {
  'user_blog_entry#list': list,
  'user_blog_entry#create': create,
  'user_blog_entry#remove': remove,
};
