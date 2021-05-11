import { domainsAdminRole } from '@viron/lib';
import { RouteContext } from '.';

// 管理ロール一覧
export const listVironAdminRoles = async (
  context: RouteContext
): Promise<void> => {
  const result = await domainsAdminRole.listByOas(context.apiDefinition);
  context.res.json(result);
};

// 管理ロール作成
export const createVironAdminRole = async (
  context: RouteContext
): Promise<void> => {
  const result = await domainsAdminRole.createOne(context.requestBody);
  context.res.status(201).json(result);
};

// 管理ロール更新
export const updateVironAdminRole = async (
  context: RouteContext
): Promise<void> => {
  await domainsAdminRole.updateOneById(
    context.params.path.id,
    context.requestBody.permissions
  );
  context.res.status(204).end();
};

// 管理ロール削除
export const removeVironAdminRole = async (
  context: RouteContext
): Promise<void> => {
  await domainsAdminRole.removeOneById(context.params.path.id);
  context.res.status(204).end();
};
