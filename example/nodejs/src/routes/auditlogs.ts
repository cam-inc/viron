import { domainsAuditLog } from '@viron/lib';
import { RouteContext } from '../application';

// 監査ログ一覧
export const listVironAuditlogs = async (
  context: RouteContext
): Promise<void> => {
  const { size, page, ...conditions } = context.params.query;
  const result = await domainsAuditLog.list(conditions, size, page);
  context.res.json(result);
};
