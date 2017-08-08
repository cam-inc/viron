/**
 * AdminRole init
 * @param {Sequelize.Model} AdminRoles
 * @param {string} defaultRole
 */
const init = (AdminRoles, defaultRole) => {
  return Promise.resolve()
    .then(() => {
      return AdminRoles.count({where: {role_id: defaultRole}});
    })
    .then(count => {
      if (count >= 1) {
        // あれば何もしない
        return;
      }

      const m = {
        role_id: defaultRole,
        method: 'GET',
        resource: '*',
      };
      return AdminRoles.create(m);
    })
  ;
};

module.exports = {
  init: init,
  controller: require('./controller'),
  helper: require('./helper'),
  middleware: require('./middleware'),
};
