import { Response, Request } from 'express';
import { Context as RequestContext } from 'openapi-backend';
import { list, createOne, updateOneById, removeOneById } from '../domains/user';

/**
 * ユーザー一覧
 * @route GET /users
 */
export const listUsers = async (
  context: RequestContext,
  _req: Request,
  res: Response
): Promise<void> => {
  // TODO: あとで修正する
  const limit = context.request.query.limit
    ? Number(context.request.query.limit)
    : undefined;
  const offset = context.request.query.offset
    ? Number(context.request.query.offset)
    : undefined;
  const result = await list(limit, offset);
  // TODO: pager
  res.json(result.list);
};

/**
 * ユーザー作成
 * @route POST /users
 */
export const createUser = async (
  context: RequestContext,
  _req: Request,
  res: Response
): Promise<void> => {
  const user = await createOne(context.request.body);
  res.status(201).json(user);
};

/**
 * ユーザー更新
 * @route PUT /users/{id}
 */
export const updateUser = async (
  context: RequestContext,
  _req: Request,
  res: Response
): Promise<void> => {
  await updateOneById(
    context.request.params.id as string,
    context.request.body
  );
  res.status(204).end();
};

/**
 * ユーザー削除
 * @route DELETE /users/{id}
 */
export const removeUser = async (
  context: RequestContext,
  _req: Request,
  res: Response
): Promise<void> => {
  await removeOneById(context.request.params.id as string);
  res.status(204).end();
};
