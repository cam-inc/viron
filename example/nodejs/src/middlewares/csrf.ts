import { NextFunction, Request, Response, RequestHandler } from 'express';
import { ConfigCsrf } from '../config';
import { logger } from '../context';
import { CSRF_IGNORE_HTTP_METHODS } from '../constants';
import { forbidden } from '@viron/lib';

export const csrf = (options: ConfigCsrf): RequestHandler => {
  logger.info('Use middlwares#csrf. %O', options);
  // allowOriginsに *.examle.com のようなワイルドカードを指定可能にするために正規表現を生成
  const regExps = options.allowOrigins.map((allowOrigin) => {
    return {
      allowOrigin: allowOrigin,
      re: new RegExp(`^${allowOrigin.replace(/\*/g, '.*')}$`),
    };
  });
  const match = (
    obj: { allowOrigin: string; re: RegExp },
    origin: string
  ): boolean => {
    return obj.re.test(origin);
  };

  const middleware: RequestHandler = (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const host = req.get('host');
    const origin = req.get('origin');

    // ignorePathsに含まれていれば無視
    if (!options.ignorePaths || options.ignorePaths.includes(req.path)) {
      return next();
    }

    logger.debug('csrf options: %o', options);
    logger.debug('csrf host: %s', host);
    logger.debug('csrf method: %s', req.method);
    logger.debug('csrf headers: %o', req.headers);
    logger.debug('csrf origin: %s', origin);

    // CSRF対象外のHTTPメソッドの場合は無視
    if (CSRF_IGNORE_HTTP_METHODS.includes(req.method)) {
      return next();
    }

    // originがない場合は403
    if (!origin) {
      logger.error('csrf illegal origin. origin: %s', origin);
      return next(forbidden());
    }

    // hostが異なる場合は403
    if (options.host !== host) {
      logger.error('csrf illegal host . host: %s', host);
      return next(forbidden());
    }

    // allowOriginsに含まれていればOK
    const isAllow = regExps.find((obj) => {
      return match(obj, origin);
    });
    if (isAllow) {
      return next();
    }

    logger.error('csrf illegal origin. origin: %s', origin);
    next(forbidden());
  };
  return middleware;
};
