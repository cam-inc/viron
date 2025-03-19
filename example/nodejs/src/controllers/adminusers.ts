import { domainsAdminUser } from '@viron/lib';
import { RouteContext } from '../application';

// 管理ユーザー一覧
export const listVironAdminUsers = async (
  context: RouteContext
): Promise<void> => {
  const { size, page, sort, ...conditions } = context.params.query;
  const result = await domainsAdminUser.list(conditions, size, page, sort);
  context.res.json(result);
};

// 管理ユーザー作成
export const createVironAdminUser = async (
  context: RouteContext
): Promise<void> => {
  const result = await domainsAdminUser.createOne(false, context.requestBody);
  context.res.status(201).json(result);
};

// 管理ユーザー更新
export const updateVironAdminUser = async (
  context: RouteContext
): Promise<void> => {
  await domainsAdminUser.updateOneById(
    context.params.path.id,
    context.requestBody
  );
  context.res.status(204).end();
};

// 管理ユーザー削除
export const removeVironAdminUser = async (
  context: RouteContext
): Promise<void> => {
  await domainsAdminUser.removeOneById(context.params.path.id);
  context.res.status(204).end();
};
