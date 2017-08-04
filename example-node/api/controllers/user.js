
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
      if (req.swagger.params.name.value) {
        options.where = {name: {$like: req.swagger.params.name.value+'%'}};
      }
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
      var data = new Object();
      data.birthday = req.body.birthday;
      data.blood_type = req.body.blood_type;
      data.job = req.body.job;
      data.name = req.body.name;
      data.sex = req.body.sex;
      return Users.create(data);
    })
    .then(data => {
      res.json(data);
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

/**
 * Controller : update  User
 * HTTP Method : PUT
 * PATH : /user/:id
 *
 * @returns {function(*, *)}
 */

const update = (req, res) => {
  const store = shared.context.getStoreMain();
  const Users = store.models.Users;
  return Promise.resolve()
    .then(() => {
      var data = new Object();
      data.birthday = req.body.birthday;
      data.blood_type = req.body.blood_type;
      data.job = req.body.job;
      data.name = req.body.name;
      data.sex = req.body.sex;
      const id = req.swagger.params.id.value;
      return Users.update(data, {where: {id}});
    })
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
  'user#update': update,
};
