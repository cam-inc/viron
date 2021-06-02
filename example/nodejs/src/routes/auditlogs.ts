import { domainsAuditLog } from '@viron/lib';
import { RouteContext } from '../application';

// 監査ログ一覧
export const listVironAuditlogs = async (
  context: RouteContext
): Promise<void> => {
  const result = await domainsAuditLog.list();
  context.res.json(result);
};
