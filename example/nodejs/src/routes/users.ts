import { RouteContext } from '.';
import { list, createOne, updateOneById, removeOneById } from '../domains/user';

/**
 * ユーザー一覧
 * @route GET /users
 */
export const listUsers = async (context: RouteContext): Promise<void> => {
  const { limit, offset } = context.params.query;
  const result = await list(limit, offset);
  // TODO: pager
  context.res.json(result.list);
};

/**
 * ユーザー作成
 * @route POST /users
 */
export const createUser = async (context: RouteContext): Promise<void> => {
  const user = await createOne(context.requestBody);
  context.res.status(201).json(user);
};

/**
 * ユーザー更新
 * @route PUT /users/{id}
 */
export const updateUser = async (context: RouteContext): Promise<void> => {
  await updateOneById(context.params.path.id, context.requestBody);
  context.res.status(204).end();
};

/**
 * ユーザー削除
 * @route DELETE /users/{id}
 */
export const removeUser = async (context: RouteContext): Promise<void> => {
  await removeOneById(context.params.path.id);
  context.res.status(204).end();
};
