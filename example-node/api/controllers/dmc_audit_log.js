const lib = require('../../lib');
const shared = require('../../shared');

/**
 * DMCがデフォルトで提供している監査ログ
 * @type {{audit_log#list (function(*, *, *))}}
 */
module.exports = {
  'audit_log#list': lib.audit_log.controller.list(
    shared.context.getStoreMain().models.AuditLogs
  ),
};
