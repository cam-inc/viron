const getSourceIp = req => {
  return (req.get('x-forwarded-for') || '').split(',')[0] ||
    req.connection.remoteAddress;
};

/**
 * Middleware : Write Audit Log
 *
 * @param AuditLogs Sequelize.model
 * @returns {function(*, *, *)}
 */
module.exports = AuditLogs => {
  return (req, res, next) => {
    // 監査ログ出力を除外するリクエスト
    if (req.path === '/ping' || req.method === 'OPTIONS') {
      return next();
    }

    const originalEnd = res.end;
    res.end = (data, encoding) => {
      res.end = originalEnd;

      const log = {
        request_method: req.method,
        request_uri: req.path,
        user_id: req.auth ? req.auth.sub : '',
        request_body: JSON.stringify(req.body || {}),
        status_code: res.statusCode,
        source_ip: getSourceIp(req),
      };
      AuditLogs.create(log);

      res.end(data, encoding);
    };

    next();
  };
};
