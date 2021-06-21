import { RouteContext } from '../application';
import { list, createOne, updateOneById, removeOneById } from '../domains/user';

// ユーザー一覧
export const listUsers = async (context: RouteContext): Promise<void> => {
  const { limit, offset } = context.params.query;
  const result = await list(limit, offset);
  context.res.json(result);
};

// ユーザー作成
export const createUser = async (context: RouteContext): Promise<void> => {
  const user = await createOne(context.requestBody);
  context.res.status(201).json(user);
};

// ユーザー更新
export const updateUser = async (context: RouteContext): Promise<void> => {
  await updateOneById(context.params.path.userId, context.requestBody);
  context.res.status(204).end();
};

// ユーザー削除
export const removeUser = async (context: RouteContext): Promise<void> => {
  await removeOneById(context.params.path.userId);
  context.res.status(204).end();
};
