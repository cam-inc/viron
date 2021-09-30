import { FilterQuery, QueryOptions } from 'mongoose';
import {
  ListWithPager,
  getPagerResults,
  getMongoQueryOptions,
  getMongoSortOptions,
  normalizeMongoFilterQuery,
} from '@viron/lib';
import {
  Purchase,
  PurchaseCreateAttributes,
  PurchaseUpdateAttributes,
} from '../../domains/purchase';
import {
  PurchaseModel,
  PurchaseDocument,
} from '../../stores/definitions/mongo/purchases';
import { ctx } from '../../context';

const getModel = (): PurchaseModel =>
  ctx.stores.main.models.purchases as PurchaseModel;

const convertConditions = (
  conditions: FilterQuery<PurchaseDocument>
): FilterQuery<PurchaseDocument> => {
  if (conditions.id) {
    conditions._id = conditions.id;
    delete conditions.id;
  }
  return conditions;
};

export const findOneById = async (id: string): Promise<Purchase | null> => {
  const model = getModel();
  const doc = await model.findById(id);
  return doc ? doc.toJSON() : null;
};

export const find = async (
  conditions: FilterQuery<PurchaseDocument> = {},
  sort: string[] | null = null,
  options?: QueryOptions
): Promise<Purchase[]> => {
  const model = getModel();
  options = options ?? {};
  options.sort = getMongoSortOptions(sort);
  const docs = await model.find(
    normalizeMongoFilterQuery(convertConditions(conditions)),
    null,
    options
  );
  return docs.map((doc) => doc.toJSON());
};

export const findWithPager = async (
  conditions: FilterQuery<PurchaseDocument> = {},
  size?: number,
  page?: number,
  sort: string[] | null = null
): Promise<ListWithPager<Purchase>> => {
  const options = getMongoQueryOptions(size, page);
  const [list, totalCount] = await Promise.all([
    find(conditions, sort, options),
    count(conditions),
  ]);
  return {
    ...getPagerResults(totalCount, size, page),
    list,
  };
};

export const findOne = async (
  conditions: FilterQuery<PurchaseDocument> = {}
): Promise<Purchase | null> => {
  const model = getModel();
  const doc = await model.findOne(
    normalizeMongoFilterQuery(convertConditions(conditions))
  );
  return doc ? doc.toJSON() : null;
};

export const count = async (
  conditions: FilterQuery<PurchaseDocument> = {}
): Promise<number> => {
  const model = getModel();
  return await model.countDocuments(
    normalizeMongoFilterQuery(convertConditions(conditions))
  );
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
