
const pager = require('../../lib/pager');
const shared = require('../../shared');

/**
 * Controller : List  User
 * HTTP Method : GET
 * PATH : /user
 *
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
 * @returns {function(*, *)}
 */

const create = (req, res) => {
  const store = shared.context.getStoreMain();
  const Users = store.models.Users;
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

/**
 * Controller : Delete  User
 * HTTP Method : DELETE
 * PATH : /user/:id
 *
 * @returns {function(*)}
 */

const remove = (req, res) => {
  const store = shared.context.getStoreMain();
  const Users = store.models.Users;
  const id = req.swagger.params.id.value;
  return Users.destroy({where: {id}, force: true})
    .then(() => {
      res.status(204).end();
    })
  ;
}

/**
 * Controller : Show  User
 * HTTP Method : GET
 * PATH : /user/:id
 *
 * @returns {function(*)}
 */

const show = (req, res) => {
  const store = shared.context.getStoreMain();
  const Users = store.models.Users;
  const attributes = Object.keys(req.swagger.operation.responses['200'].schema.properties);
  const id = req.swagger.params.id.value;
  Users.findById(id, {attributes})
    .then(data => {
      res.json(data);
    })
  ;
}


module.exports = {
  'user#list': list,
  'user#create': create,
  'user#remove': remove,
  'user#show': show,
};
