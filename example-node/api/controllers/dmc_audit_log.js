const dmclib = require('node-dmclib');
const shared = require('../../shared');

/**
 * DMCがデフォルトで提供している監査ログ
 * @type {{audit_log#list (function(*, *, *))}}
 */
module.exports = {
  'audit_log#list': dmclib.auditLog.controller.registerList(
    shared.context.getStoreMain().models.AuditLogs
  ),
};
