const jwt = require('express-jwt');

const errors = require('../../errors');

const getToken = options => {
  return req => {
    const jwtHeader = req.get(options.header_key);
    if (jwtHeader) {
      const parts = jwtHeader.split(' ');
      if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          return credentials;
        }
      }
    }
  };
};

module.exports = options => {
  // tokenの検証
  return (req, res, next) => {
    jwt({
      secret: new Buffer(options.rsa_public_key),
      credentialsRequired: options.credentials_required,
      requestProperty: 'auth',
      algorithms: [options.algorithm],
      getToken: getToken(options),
    })(req, res, err => {
      if (err instanceof jwt.UnauthorizedError) {
        res.setHeader('WWW-Authenticate', 'Bearer token_type="JWT" realm="Authorization Required"');
        return next(errors.frontend.Unauthorized());
      }
      if (err) {
        return next(err);
      }
      next();
    });
  };
};
