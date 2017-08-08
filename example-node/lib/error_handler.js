const util = require('util');

module.exports = () => {
  /**
   * Error Handler
   */
  return (context, next) => {
    const err = context.error;
    if (!util.isError(err)) {
      // エラーじゃなければ無視
      return next();
    }

    // 常にjson
    context.headers['Content-Type'] = 'application/json';

    const req = context.request;
    const debug = {
      debug: {
        stack: err.stack && err.stack.split('\n'),
        name: err.name,
        message: err.message,
      },
      error: err,
      request_headers: req.headers,
    };

    // ステータスコードをcontextに反映
    if (!context.statusCode || context.statusCode < 400) {
      if (context.response && context.response.statusCode && context.response.statusCode >= 400) {
        context.statusCode = context.response.statusCode;
      } else if (err.statusCode && err.statusCode >= 400) {
        context.statusCode = err.statusCode;
        delete err.statusCode;
      } else {
        context.statusCode = 500;
      }
    }

    console.error(util.inspect(debug));
    delete context.error; // これをしないとjsonで返せない
    next(null, JSON.stringify(debug));
  };
};
