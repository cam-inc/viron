import {
  ACCESS_CONTROL_ALLOW_CREDENTIALS,
  ACCESS_CONTROL_ALLOW_HEADERS,
  ACCESS_CONTROL_ALLOW_METHODS,
  ACCESS_CONTROL_EXPOSE_HEADERS,
  HTTP_HEADER,
} from '@viron/lib';
import { RequestHandler, NextFunction, Request, Response } from 'express';

export type AllowOrigins = string[];

export interface AclOptions {
  allowOrigins: AllowOrigins;
}

const getAllowOrigin = (
  req: Request,
  allowOrigins: AllowOrigins
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
      ACCESS_CONTROL_ALLOW_METHODS.join(',')
    );
    res.set(
      HTTP_HEADER.ACCESS_CONTROL_ALLOW_HEADERS,
      ACCESS_CONTROL_ALLOW_HEADERS.join(',')
    );
    res.set(
      HTTP_HEADER.ACCESS_CONTROL_EXPOSE_HEADERS,
      ACCESS_CONTROL_EXPOSE_HEADERS.join(',')
    );

    const allowOrigin = getAllowOrigin(req, options.allowOrigins);
    if (allowOrigin) {
      res.set(HTTP_HEADER.ACCESS_CONTROL_ALLOW_ORIGIN, allowOrigin);
    }

    next();
  };
};
