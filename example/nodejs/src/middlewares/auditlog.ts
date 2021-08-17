import { domainsAuditLog } from '@viron/lib';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { logger } from '../context';

const getSourceIp = (req: Request): string | null => {
  return (
    (req.get('x-forwarded-for') || '').split(',')[0] ||
    req.socket.remoteAddress ||
    null
  );
};

type Callback = () => void;

export const middlewareAuditLog = (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const originalEnd = res.end;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    res.end = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chunk: any,
      encoding?: BufferEncoding | Callback,
      cb?: Callback
    ): void => {
      res.end = originalEnd;

      const log = {
        requestMethod: req.method,
        requestUri: req.path,
        sourceIp: getSourceIp(req),
        userId: req._context.auth?.sub || '',
        statusCode: res.statusCode,
      };
      domainsAuditLog
        .createOneWithMasking(
          req.path,
          req.method,
          req._context.apiDefinition,
          log,
          req.body
        )
        .catch((e) => {
          logger.warn('AuditLog Create fail. %o', e);
        });

      if (cb) {
        res.end(chunk, encoding as BufferEncoding, cb);
      } else if (encoding) {
        res.end(chunk, encoding as Callback);
      } else {
        res.end(chunk);
      }
    };

    next();
  };
};
