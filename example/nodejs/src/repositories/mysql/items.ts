import { FindOptions, Includeable, WhereOptions } from 'sequelize';
import {
  getMysqlFindOptions,
  getMysqlSortOptions,
  getPagerResults,
  ListWithPager,
  normalizeMysqlFilterQuery,
} from '@viron/lib';
import { ctx } from '../../context';
import {
  Item,
  ItemCreateAttributes,
  ItemUpdateAttributes,
} from '../../domains/item';
import { ItemModelStatic } from '../../infrastructures/mysql/models/items';
import { ItemDetailModelStatic } from '../../infrastructures/mysql/models/item_details';
import { MysqlModels } from '../../infrastructures/mysql/models';

const getModel = (): ItemModelStatic =>
  ctx.stores.main.models.items as ItemModelStatic;

const getDetailModel = (): ItemDetailModelStatic =>
  (ctx.stores.main.models as MysqlModels).itemdetails as ItemDetailModelStatic;

const getCommonIncludes = (): Includeable[] => {
  return [
    {
      model: getDetailModel(),
      required: false,
      as: 'detail',
    },
  ];
};
export const findOneById = async (id: string): Promise<Item | null> => {
  const model = getModel();
  const doc = await model.findByPk(id);
  return doc ? (doc.toJSON() as Item) : null;
};

export const find = async (
  conditions: WhereOptions<Item> = {},
  sort: string[] | null = null,
  options: FindOptions<Item> = {}
): Promise<Item[]> => {
  const model = getModel();
  options.where = normalizeMysqlFilterQuery(conditions);
  options.order = getMysqlSortOptions(sort);
  options.include = getCommonIncludes();
  const docs = await model.findAll(options);
  return docs.map((doc) => doc.toJSON() as Item);
};

export const findWithPager = async (
  conditions: WhereOptions<Item> = {},
  size?: number,
  page?: number,
  sort: string[] | null = null
): Promise<ListWithPager<Item>> => {
  const model = getModel();
  const options = getMysqlFindOptions(size, page);
  options.where = normalizeMysqlFilterQuery(conditions);
  options.order = getMysqlSortOptions(sort);
  options.include = getCommonIncludes();
  const result = await model.findAndCountAll(options);
  return {
    ...getPagerResults(result.count, size, page),
    list: result.rows.map((doc) => doc.toJSON() as Item),
  };
};

export const findOne = async (
  conditions: WhereOptions<Item> = {}
): Promise<Item | null> => {
  const model = getModel();
  const doc = await model.findOne({
    where: normalizeMysqlFilterQuery(conditions),
    include: getCommonIncludes(),
  });
  return doc ? (doc.toJSON() as Item) : null;
};

export const count = async (
  conditions: WhereOptions<Item> = {}
): Promise<number> => {
  const model = getModel();
  return await model.count({ where: normalizeMysqlFilterQuery(conditions) });
};

export const createOne = async (obj: ItemCreateAttributes): Promise<Item> => {
  const detailModel = getDetailModel();
  const detail = obj.detail;
  const detailDoc = await detailModel.create(detail);
  const model = getModel();
  const doc = await model.create(Object.assign({ id: detailDoc.itemId }, obj));
  const result = doc.toJSON() as Item;
  result.detail = detail;
  return result;
};

export const updateOneById = async (
  id: string,
  obj: ItemUpdateAttributes
): Promise<void> => {
  const detailModel = getDetailModel();
  await detailModel.update(obj.detail, { where: { itemId: id } });
  const model = getModel();
  await model.update(obj, { where: { id } });
};

export const removeOneById = async (id: string): Promise<void> => {
  const model = getModel();
  await model.destroy({ where: { id } });
  const detailModel = getDetailModel();
  await detailModel.destroy({ where: { itemId: id } });
};
