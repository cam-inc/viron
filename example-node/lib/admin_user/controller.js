const pager = require('../pager');

const helperEMail = require('../auth/email').helper;

/**
 * Controller : List Admin User
 * HTTP Method : GET
 * PATH : /adminuser
 *
 * @param AdminUsers Sequelize.model
 * @returns {function(*, *, *)}
 */
const list = AdminUsers => {
  return (req, res) => {
    const attributes = Object.keys(req.swagger.operation.responses['200'].schema.items.properties);
    const limit = req.query.limit;
    const offset = req.query.offset;
    return Promise.resolve()
      .then(() => {
        return AdminUsers.count('AdminUsers');
      })
      .then(count => {
        pager.setResHeader(res, limit, offset, count);
        const options = {
          attributes,
          limit,
          offset,
        };
        return AdminUsers.findAll(options);
      })
      .then(list => {
        res.json(list);
      })
    ;
  };
};

/**
 * Controller : Create Admin User
 * HTTP Method : POST
 * PATH : /adminuser
 *
 * @param AdminUsers Sequelize.model
 * @param defaultRole
 * @returns {function(*, *, *)}
 */
const create = (AdminUsers, defaultRole) => {
  return (req, res) => {
    return Promise.resolve()
      .then(() => {
        // パスワードをハッシュ化
        const salt = helperEMail.genSalt();
        return helperEMail.genHash(req.body.password, salt)
          .then(hashedPassword => {
            return {password: hashedPassword, salt};
          });
      })
      .then(data => {
        data.email = req.body.email;
        data.role_id = defaultRole;
        return AdminUsers.create(data);
      })
      .then(data => {
        res.json(data);
      })
    ;
  };
};

/**
 * Controller : Get Admin User
 * HTTP Method : GET
 * PATH : /adminuser/:id
 *
 * @param AdminUsers Sequelize.model
 * @returns {function(*, *, *)}
 */
const get = AdminUsers => {
  return (req, res) => {
    const attributes = Object.keys(req.swagger.operation.responses['200'].schema.items.properties);
    const id = req.swagger.params.id.value;
    AdminUsers.findById(id, {attributes})
      .then(data => {
        res.json(data);
      })
    ;
  };
};

/**
 * Controller : Remove Admin User
 * HTTP Method : DELETE
 * PATH : /adminuser/:id
 *
 * @param AdminUsers Sequelize.model
 * @returns {function(*, *, *)}
 */
const remove = AdminUsers => {
  return (req, res) => {
    const id = req.swagger.params.id.value;
    AdminUsers.destroy({where: {id}, force: true})
      .then(() => {
        res.status(204).end();
      })
    ;
  };
};

/**
 * Controller : Update Admin User
 * HTTP Method : PUT
 * PATH : /adminuser/:id
 *
 * @param AdminUsers Sequelize.model
 * @returns {function(*, *, *)}
 */
const update = AdminUsers => {
  return (req, res) => {
    Promise.resolve()
      .then(() => {
        const password = req.body.password;
        if (!password) {
          return {};
        }

        // パスワードをハッシュ化
        const salt = helperEMail.genSalt();
        return helperEMail.genHash(req.body.password, salt)
          .then(hashedPassword => {
            return {password: hashedPassword, salt};
          })
        ;
      })
      .then(data => {
        data.role_id = req.body.role_id;
        const id = req.swagger.params.id.value;
        return AdminUsers.update(data, {where: {id}});
      })
      .then(data => {
        res.json(data);
      })
    ;
  };
};

module.exports = {
  list: list,
  create: create,
  get: get,
  remove: remove,
  update: update,
};
