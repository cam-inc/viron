import { Response, Request } from 'express';
import { Context as RequestContext } from 'openapi-backend';

/**
 * root
 * @route GET /
 */
export const getRoot = async (
  _context: RequestContext,
  _req: Request,
  res: Response
): Promise<void> => {
  res.redirect(301, '/oas');
};
