import { domainsAuditLog } from '@viron/lib';
import { RouteContext } from '.';

/**
 * 監査ログ一覧
 * @route GET /auditlogs
 */
export const listVironAuditlogs = async (
  context: RouteContext
): Promise<void> => {
  const result = await domainsAuditLog.list();
  context.res.json(result);
};
