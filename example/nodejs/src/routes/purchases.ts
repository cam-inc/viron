import { RouteContext } from '../application';
import {
  list,
  createOne,
  updateOneById,
  removeOneById,
  findOne,
} from '../domains/purchase';

// 購買情報一覧
export const listPurchases = async (context: RouteContext): Promise<void> => {
  const { limit, offset, purchaseId } = context.params.query;
  const conditions = purchaseId ? { id: purchaseId } : {};
  const result = await list(conditions, limit, offset);
  context.res.json(result);
};

// 購買情報作成
export const createPurchase = async (context: RouteContext): Promise<void> => {
  const purchase = await createOne(context.requestBody);
  context.res.status(201).json(purchase);
};

// 購買情報更新
export const updatePurchase = async (context: RouteContext): Promise<void> => {
  await updateOneById(context.params.path.purchaseId, context.requestBody);
  context.res.status(204).end();
};

// 購買情報削除
export const removePurchase = async (context: RouteContext): Promise<void> => {
  await removeOneById(context.params.path.purchaseId);
  context.res.status(204).end();
};

// ユーザーの購買情報一覧
export const listUserPurchases = async (
  context: RouteContext
): Promise<void> => {
  const { limit, offset } = context.params.query;
  const { userId } = context.params.path;
  const result = await list({ userId }, limit, offset);
  context.res.json(result);
};

// ユーザーの購買情報1件取得
export const getUserPurchase = async (context: RouteContext): Promise<void> => {
  const { userId, purchaseId } = context.params.path;
  const result = await findOne({ id: purchaseId, userId });
  context.res.json(result);
};
