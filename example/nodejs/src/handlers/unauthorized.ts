import { NextFunction, Request, Response } from 'express';
import { Context as RequestContext } from 'openapi-backend';
import { unauthorized } from '../errors';

// securityHandlerでエラーになったリクエストをハンドリング
export const unauthorizedHandler = async (
  _context: RequestContext,
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  next(unauthorized());
};
