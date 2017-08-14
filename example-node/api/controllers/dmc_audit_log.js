const shared = require('../../shared');
const dmclib = shared.context.getDmcLib();

/**
 * DMCがデフォルトで提供している監査ログ
 * @type {{audit_log#list (function(*, *, *))}}
 */
module.exports = {
  'audit_log#list': dmclib.auditLog.controller.list,
};
