const shared = require('../shared');
const vironlib = shared.context.getVironLib();

/**
 * Vironがデフォルトで提供している監査ログ
 * @type {{audit_log#list (function(*, *, *))}}
 */
module.exports = {
  'audit_log#list': vironlib.auditLog.controller.list,
};
