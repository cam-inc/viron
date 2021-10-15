import { FindOptions, WhereOptions } from 'sequelize/types';
import {
  getMysqlFindOptions,
  getMysqlSortOptions,
  getPagerResults,
  ListWithPager,
  normalizeMysqlFilterQuery,
} from '@viron/lib';
import { ctx } from '../../context';
import { Media, MediaCreateAttributes } from '../../domains/media';
import { MediaModelCtor } from '../../infrastructures/mysql/models/medias';

const getModel = (): MediaModelCtor =>
  ctx.stores.main.models.medias as MediaModelCtor;

export const findOneById = async (id: string): Promise<Media | null> => {
  const model = getModel();
  const doc = await model.findByPk(id);
  return doc ? (doc.toJSON() as Media) : null;
};

export const find = async (
  conditions: WhereOptions<Media> = {},
  sort: string[] | null = null,
  options: FindOptions<Media> = {}
): Promise<Media[]> => {
  const model = getModel();
  options.where = normalizeMysqlFilterQuery(conditions);
  options.order = getMysqlSortOptions(sort);
  const docs = await model.findAll(options);
  return docs.map((doc) => doc.toJSON() as Media);
};

export const findWithPager = async (
  conditions: WhereOptions<Media> = {},
  size?: number,
  page?: number,
  sort: string[] | null = null
): Promise<ListWithPager<Media>> => {
  const model = getModel();
  const options = getMysqlFindOptions(size, page);
  options.where = normalizeMysqlFilterQuery(conditions);
  options.order = getMysqlSortOptions(sort);
  const result = await model.findAndCountAll(options);
  return {
    ...getPagerResults(result.count, size, page),
    list: result.rows.map((doc) => doc.toJSON() as Media),
  };
};

export const findOne = async (
  conditions: WhereOptions<Media> = {}
): Promise<Media | null> => {
  const model = getModel();
  const doc = await model.findOne({
    where: normalizeMysqlFilterQuery(conditions),
  });
  return doc ? (doc.toJSON() as Media) : null;
};

export const count = async (
  conditions: WhereOptions<Media> = {}
): Promise<number> => {
  const model = getModel();
  return await model.count({ where: normalizeMysqlFilterQuery(conditions) });
};

export const createOne = async (obj: MediaCreateAttributes): Promise<Media> => {
  const model = getModel();
  const doc = await model.create(obj);
  return doc.toJSON() as Media;
};

export const removeOneById = async (id: string): Promise<void> => {
  const model = getModel();
  await model.destroy({ where: { id } });
};
