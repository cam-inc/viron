import { domainsAuditLog } from '@viron/lib';
import { Response, Request } from 'express';
import { Context as RequestContext } from 'openapi-backend';

/**
 * 監査ログ一覧
 * @route GET /auditlogs
 */
export const listVironAuditlogs = async (
  _context: RequestContext,
  _req: Request,
  res: Response
): Promise<void> => {
  const result = await domainsAuditLog.list();
  res.json(result);
};
