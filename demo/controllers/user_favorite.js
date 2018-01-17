const shared = require('../shared');
const context = shared.context;

/**
 * Controller : List User Favorite
 * HTTP Method : GET
 * PATH : /userfavorite
 *
 * @returns {Promise.<TResult>}
 */
const list = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const UserFavorites = store.models.UserFavorites;
  const options = {
    attributes: ['user_id', 'user_blog_id'],
  };
  return storeHelper.list(store, UserFavorites, {}, options)
    .then(data => {
      const map = {};
      data.list.forEach(obj => {
        map[obj.user_id] = map[obj.user_id] || {};
        map[obj.user_id][obj.user_blog_id] = true;
      });
      const list = Object.keys(map).map(userId => {
        return {
          user_id: userId,
          user_blog_ids: map[userId],
        };
      });
      res.json(list);
    })
    .catch(next)
  ;
};

/**
 * Controller : Create  User Favorite
 * HTTP Method : POST
 * PATH : /userfavorite
 *
 * @returns {Promise.<TResult>}
 */
const create = (req, res, next) => {
  const store = context.getStoreMain();
  const UserFavorites = store.models.UserFavorites;

  const list = [];
  for (const userBlogId in req.body.user_blog_ids) {
    if (req.body.user_blog_ids[userBlogId]) {
      list.push({
        user_id: req.body.user_id,
        user_blog_id: userBlogId,
      });
    }
  }
  return UserFavorites.bulkCreate(list)
    .then(() => {
      res.json(req.body);
    })
    .catch(next)
  ;
};

/**
 * Controller : Delete  User Favorite
 * HTTP Method : DELETE
 * PATH : /userfavorite/:user_id
 *
 * @returns {Promise.<TResult>}
 */
const remove = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const UserFavorites = store.models.UserFavorites;
  const query = {
    user_id: req.swagger.params.user_id.value,
  };
  const options = {
    force: true, // physical delete
  };
  return storeHelper.remove(store, UserFavorites, query, options)
    .then(() => {
      res.status(204).end();
    })
    .catch(next)
  ;
};

/**
 * Controller : Update  User Favorite
 * HTTP Method : PUT
 * PATH : /userfavorite/:user_id
 *
 * @returns {Promise.<TResult>}
 */
const update = (req, res, next) => {
  const store = context.getStoreMain();
  const UserFavorites = store.models.UserFavorites;
  const userId = req.swagger.params.user_id.value;

  const list = [];
  for (const userBlogId in req.body.user_blog_ids) {
    if (req.body.user_blog_ids[userBlogId]) {
      list.push({
        user_id: userId,
        user_blog_id: userBlogId,
      });
    }
  }
  return Promise.resolve()
    .then(() => {
      return store.instance.transaction();
    })
    .then(t => {
      return UserFavorites.destroy({where: {user_id: userId}, force: true, transaction: t})
        .then(() => {
          return UserFavorites.bulkCreate(list, {transaction: t});
        })
        .then(() => {
          return t.commit();
        })
        .catch(() => {
          return t.rollback();
        })
      ;
    })
    .then(() => {
      return res.json({user_id: userId, user_blog_ids: req.body.user_blog_ids});
    })
    .catch(next)
  ;
};

module.exports = {
  'user_favorite#list': list,
  'user_favorite#create': create,
  'user_favorite#remove': remove,
  'user_favorite#update': update,
};
