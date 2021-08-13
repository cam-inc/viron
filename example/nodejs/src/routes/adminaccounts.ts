import { domainsAdminAccount, forbidden } from '@viron/lib';
import { RouteContext } from '../application';

// 管理アカウント設定取得
export const listVironAdminAccounts = async (
  context: RouteContext
): Promise<void> => {
  const result = await domainsAdminAccount.listById(context.user?.id);
  context.res.json(result);
};

// 管理アカウント設定更新
export const updateVironAdminAccount = async (
  context: RouteContext
): Promise<void> => {
  if (context.user?.id !== context.params.path.id) {
    throw forbidden();
  }

  await domainsAdminAccount.updateOneById(
    context.params.path.id,
    context.requestBody
  );
  context.res.status(204).end();
};
