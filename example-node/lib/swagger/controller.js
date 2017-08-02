const deepClone = require('mout/lang/deepClone');
const isEmpty = require('mout/lang/isEmpty');

const helperAdminRole = require('../admin_role').helper;

/**
 * Controller : swagger.json
 * HTTP Method : GET
 * PATH : /swagger.json
 *
 * @returns {function(*, *, *)}
 */
const registerShow = () => {
  return (req, res) => {
    if (!req.swagger.operation.security) {
      // swagger.json自体が非認証の場合はそのまま返す
      return res.json(req.swagger.swaggerObject);
    }

    // 権限がないパスをswagger.jsonから消して返す
    const swagger = deepClone(req.swagger.swaggerObject);
    const roles = req.auth.roles;
    for (let path in swagger.paths) {
      for (let m in swagger.paths[path]) {
        if (!helperAdminRole.canAccess(path, m, roles)) {
          // 権限がないパスをswaggerから削除
          delete swagger.paths[path][m];
        }
      }
      if (isEmpty(swagger.paths[path])) {
        // pathが空になった場合はキー自体を削除
        delete swagger.paths[path];
      }
    }
    res.json(swagger);
  };
};

module.exports = {
  registerShow,
};
