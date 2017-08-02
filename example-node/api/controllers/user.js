
const pager = require('../../lib/pager');
const shared = require('../../shared');

/**
 * Controller : List  User
 * HTTP Method : GET
 * PATH : /user
 *
 * @param Users Sequelize.model
 * @returns {function(*, *, *)}
 */

const list = (req, res) => {
  const store = shared.context.getStoreMain();
  const Users = store.models.Users;
  const attributes = Object.keys(req.swagger.operation.responses['200'].schema.items.properties);
  const limit = req.query.limit;
  const offset = req.query.offset;
  return Promise.resolve()
    .then(() => {
      return Users.count();
    })
    .then(count => {
      pager.setResHeader(res, limit, offset, count);
      const options = {
        attributes,
        limit,
        offset,
      };
      return Users.findAll(options);
    })
    .then(list => {
      res.json(list);
    })
    ;
};

/**
 * Controller : Create  User
 * HTTP Method : POST
 * PATH : /user
 *
 * @param Users Sequelize.model
 * @returns {function(*, *)}
 */

const create = (req, res) => {
  const store = shared.context.getStoreMain();
  const Users = store.models.Users;
  process.on('unhandledRejection', console.dir);
  return Promise.resolve()
    .then(() => {
      var date = new Object();
      date.birthday = req.body.birthday;
      date.blood_type = req.body.blood_type;
      date.job = req.body.job;
      date.name = req.body.name;
      date.sex = req.body.sex;
      return Users.create(date);
    })
    .then(date => {
      res.json(date);
    })
    ;
}

module.exports = {
  'user#list': list,
  'user#create': create,
};
