import { Response, Request, NextFunction } from 'express';
import { Context as RequestContext, Document } from 'openapi-backend';

/**
 * oas取得
 * @route GET /oas
 */
export const getOas = async (
  _context: RequestContext,
  _req: Request,
  res: Response,
  _next: NextFunction,
  apiDefinition: Document
): Promise<void> => {
  res.json(apiDefinition);
};
