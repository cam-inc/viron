/**
 * Middleware : Set Access-Control Response Headers
 *
 * @param {object} options - {allow_origin: '', allow_headers: '', expose_headers: ''}
 * @returns {function(*, *, *)}
 */
module.exports = options => {
  return (req, res, next) => {
    res.header('Access-Control-Allow-Origin', options.allow_origin || req.get('origin'));
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD, OPTIONS');
    res.header('Access-Control-Allow-Headers', options.allow_headers);
    res.header('Access-Control-Expose-Headers', options.expose_headers);
    next();
  };
};
