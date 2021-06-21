import { ListWithPager } from '@viron/lib';
import { FindConditions, getPurchaseRepository } from '../repositories';

export interface Purchase {
  id: string;
  userId: string;
  itemId: string;
  amount: number;
  unitPrice: number;
  createdAt: number;
  updatedAt: number;
}

export interface PurchaseView extends Purchase {
  purchaseId: string; // alias to id
}

export interface PurchaseCreateAttributes {
  userId: string;
  itemId: string;
  amount: number;
  unitPrice: number;
}

export interface PurchaseUpdateAttributes {
  itemId: string;
  amount: number;
  unitPrice: number;
}

const format = (purchase: Purchase): PurchaseView => {
  return Object.assign({}, purchase, { purchaseId: purchase.id });
};

export const list = async (
  conditions?: FindConditions<Purchase>,
  limit?: number,
  offset?: number
): Promise<ListWithPager<PurchaseView>> => {
  const repository = getPurchaseRepository();
  const result = await repository.findWithPager(conditions, limit, offset);
  return {
    ...result,
    list: result.list.map(format),
  };
};

export const findOne = async (
  conditions: FindConditions<Purchase>
): Promise<PurchaseView> => {
  const repository = getPurchaseRepository();
  const purchase = await repository.findOne(conditions);
  return format(purchase);
};

export const createOne = async (
  payload: PurchaseCreateAttributes
): Promise<PurchaseView> => {
  const repository = getPurchaseRepository();
  const purchase = await repository.createOne(payload);
  return format(purchase);
};

export const updateOneById = async (
  id: string,
  payload: PurchaseUpdateAttributes
): Promise<void> => {
  const repository = getPurchaseRepository();
  await repository.updateOneById(id, payload);
};

export const removeOneById = async (id: string): Promise<void> => {
  const repository = getPurchaseRepository();
  await repository.removeOneById(id);
};
