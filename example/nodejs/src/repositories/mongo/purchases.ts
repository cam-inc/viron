import { FilterQuery, QueryOptions } from 'mongoose';
import { ListWithPager, getPagerResults } from '@viron/lib';
import {
  Purchase,
  PurchaseCreateAttributes,
  PurchaseUpdateAttributes,
} from '../../domains/purchase';
import { PurchaseModel } from '../../stores/definitions/mongo/purchases';
import { getQueryOptions } from '../../stores/helpers/mongo';
import { ctx } from '../../context';

const getModel = (): PurchaseModel =>
  ctx.stores.main.models.purchases as PurchaseModel;

export const findOneById = async (id: string): Promise<Purchase | null> => {
  const model = getModel();
  const doc = await model.findById(id);
  return doc ? doc.toJSON() : null;
};

export const find = async (
  conditions: FilterQuery<Purchase> = {},
  options?: QueryOptions
): Promise<Purchase[]> => {
  const model = getModel();
  const docs = await model.find(conditions, null, options);
  return docs.map((doc) => doc.toJSON());
};

export const findWithPager = async (
  conditions: FilterQuery<Purchase> = {},
  limit?: number,
  offset?: number
): Promise<ListWithPager<Purchase>> => {
  const options = getQueryOptions(limit, offset);
  const [list, totalCount] = await Promise.all([
    find(conditions, options),
    count(conditions),
  ]);
  return {
    ...getPagerResults(totalCount),
    list,
  };
};

export const count = async (
  conditions: FilterQuery<Purchase> = {}
): Promise<number> => {
  const model = getModel();
  return await model.countDocuments(conditions);
};

export const createOne = async (
  obj: PurchaseCreateAttributes
): Promise<Purchase> => {
  const model = getModel();
  const doc = await model.create(obj);
  return doc.toJSON();
};

export const updateOneById = async (
  id: string,
  obj: PurchaseUpdateAttributes
): Promise<void> => {
  const model = getModel();
  await model.updateOne({ _id: id }, obj);
};

export const removeOneById = async (id: string): Promise<void> => {
  const model = getModel();
  await model.deleteOne({ _id: id });
};
