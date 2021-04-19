import {
  ACCESS_CONTROL_ALLOW_CREDENTIALS,
  ACCESS_CONTROL_ALLOW_HEADERS,
  ACCESS_CONTROL_ALLOW_METHODS,
  ACCESS_CONTROL_EXPOSE_HEADERS,
  HTTP_HEADER,
} from '@viron/lib';
import { RequestHandler, NextFunction, Request, Response } from 'express';

export interface AclOptions {
  allowOrigins: string[];
}

const getAllowOrigin = (
  req: Request,
  allowOrigins: AclOptions['allowOrigins']
): string | null => {
  const origin = req.get('origin');
  if (!origin) {
    return null;
  }
  return allowOrigins.find((o: string) => o === origin || o === '*') ?? null;
};

export const middlewareAcl = (options: AclOptions): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    res.set(
      HTTP_HEADER.ACCESS_CONTROL_ALLOW_CREDENTIALS,
      ACCESS_CONTROL_ALLOW_CREDENTIALS
    );
    res.set(
      HTTP_HEADER.ACCESS_CONTROL_ALLOW_METHODS,
      ACCESS_CONTROL_ALLOW_METHODS
    );
    res.set(
      HTTP_HEADER.ACCESS_CONTROL_ALLOW_HEADERS,
      ACCESS_CONTROL_ALLOW_HEADERS
    );
    res.set(
      HTTP_HEADER.ACCESS_CONTROL_EXPOSE_HEADERS,
      ACCESS_CONTROL_EXPOSE_HEADERS
    );

    const allowOrigin = getAllowOrigin(req, options.allowOrigins);
    if (allowOrigin) {
      res.set(HTTP_HEADER.ACCESS_CONTROL_ALLOW_ORIGIN, allowOrigin);
    }

    next();
  };
};
