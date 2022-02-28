import { RouteContext } from '../application';
import { list, createOne, updateOneById, removeOneById } from '../domains/item';

// アイテム一覧
export const listItems = async (context: RouteContext): Promise<void> => {
  const { size, page, sort, itemId } = context.params.query;
  const conditions = itemId ? { id: itemId } : {};
  const result = await list(conditions, size, page, sort);
  context.res.json(result);
};

// アイテム作成
export const createItem = async (context: RouteContext): Promise<void> => {
  const item = await createOne(context.requestBody);
  context.res.status(201).json(item);
};

// アイテム更新
export const updateItem = async (context: RouteContext): Promise<void> => {
  await updateOneById(context.params.path.itemId, context.requestBody);
  context.res.status(204).end();
};

// アイテム削除
export const removeItem = async (context: RouteContext): Promise<void> => {
  await removeOneById(context.params.path.itemId);
  context.res.status(204).end();
};
