import { FindOptions, WhereOptions } from 'sequelize/types';
import { getPagerResults, ListWithPager } from '@viron/lib';
import { ctx } from '../../context';
import {
  Purchase,
  PurchaseCreateAttributes,
  PurchaseUpdateAttributes,
} from '../../domains/purchase';
import { PurchaseModelCtor } from '../../stores/definitions/mysql/purchases';
import { getFindOptions } from '../../stores/helpers/mysql';

const getModel = (): PurchaseModelCtor =>
  ctx.stores.main.models.purchases as PurchaseModelCtor;

export const findOneById = async (id: string): Promise<Purchase | null> => {
  const model = getModel();
  const doc = await model.findByPk(id);
  return doc ? (doc.toJSON() as Purchase) : null;
};

export const find = async (
  conditions: WhereOptions<Purchase> = {},
  options: FindOptions<Purchase> = {}
): Promise<Purchase[]> => {
  const model = getModel();
  options.where = conditions;
  const docs = await model.findAll(options);
  return docs.map((doc) => doc.toJSON() as Purchase);
};

export const findWithPager = async (
  conditions: WhereOptions<Purchase> = {},
  limit?: number,
  offset?: number
): Promise<ListWithPager<Purchase>> => {
  const model = getModel();
  const options = getFindOptions(limit, offset);
  options.where = conditions;
  const result = await model.findAndCountAll(options);
  return {
    ...getPagerResults(result.count),
    list: result.rows.map((doc) => doc.toJSON() as Purchase),
  };
};

export const count = async (
  conditions: WhereOptions<Purchase> = {}
): Promise<number> => {
  const model = getModel();
  return await model.count({ where: conditions });
};

export const createOne = async (
  obj: PurchaseCreateAttributes
): Promise<Purchase> => {
  const model = getModel();
  const doc = await model.create(obj);
  return doc.toJSON() as Purchase;
};

export const updateOneById = async (
  id: string,
  obj: PurchaseUpdateAttributes
): Promise<void> => {
  const model = getModel();
  await model.update(obj, { where: { id } });
};

export const removeOneById = async (id: string): Promise<void> => {
  const model = getModel();
  await model.destroy({ where: { id } });
};
