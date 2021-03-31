import { constants } from '@viron/lib';
import { NextFunction, Request, Response } from 'express';
import { Context as RequestContext } from 'openapi-backend';
import { VIRON_AUTHTYPES_PATH } from '../constant';
import { unauthorized } from '../errors';

const { HTTP_HEADER } = constants;

// securityHandlerでエラーになったリクエストをハンドリング
export const unauthorizedHandler = async (
  _context: RequestContext,
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  res.set(HTTP_HEADER.X_VIRON_AUTHTYPES_PATH, VIRON_AUTHTYPES_PATH);
  next(unauthorized());
};
