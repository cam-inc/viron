import { Response, Request, NextFunction } from 'express';
import { Context as RequestContext, Document } from 'openapi-backend';

/**
 * swagger.json
 * @route GET /swagger.json
 */
export const get = async (
  _context: RequestContext,
  _req: Request,
  res: Response,
  _next: NextFunction,
  apiDefinition: Document
): Promise<void> => {
  res.json(apiDefinition);
};
