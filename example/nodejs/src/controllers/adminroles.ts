import { domainsAdminRole } from '@viron/lib';
import { RouteContext } from '../application';

// 管理ロール一覧
export const listVironAdminRoles = async (
  context: RouteContext
): Promise<void> => {
  const { size, page } = context.params.query;
  const result = await domainsAdminRole.listByOas(
    context.req._context.apiDefinition,
    size,
    page
  );

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

// リソース一覧(enum用)
export const listVironResourceIds = async (
  context: RouteContext
): Promise<void> => {
  const resouceIds = domainsAdminRole.listResourcesByOas(
    context.req._context.apiDefinition
  );
  context.res.json(resouceIds);
};
