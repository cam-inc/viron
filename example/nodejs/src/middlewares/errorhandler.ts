import { ErrorRequestHandler } from 'express';
import accepts from 'accepts';
import { HTTP_HEADER } from '@viron/lib';
import { logger } from '../context';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stringify = (val: any): string => {
  if (val instanceof Error) {
    return String(val.stack ?? val);
  }
  return JSON.stringify(val);
};

export const middlewareErrorHandler = (): ErrorRequestHandler => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err, req, res, _next): void => {
    if (err.statusCode) {
      res.statusCode = err.statusCode;
    }
    if (err.status) {
      res.statusCode = err.status;
    }
    if (res.statusCode < 400) {
      res.statusCode = 500;
    }

    logger.error(
      'An error occured. %o, %s',
      err,
      err.stack ?? new Error().stack
    );

    const accept = accepts(req);
    switch (accept.type(['json', 'text'])) {
      case 'json': {
        res.setHeader(
          HTTP_HEADER.CONTENT_TYPE,
          'application/json; charset=utf-8'
        );
        const error = { message: err.message, stack: err.stack };
        res.json(error);
        break;
      }
      default:
        res.setHeader(HTTP_HEADER.CONTENT_TYPE, 'text/plain; charset=utf-8');
        res.send(stringify(err));
        break;
    }
  };
};
