import { FindOptions, WhereOptions } from 'sequelize/types';
import {
  getMysqlFindOptions,
  getMysqlSortOptions,
  getPagerResults,
  ListWithPager,
  normalizeMysqlFilterQuery,
} from '@viron/lib';
import { ctx } from '../../context';
import {
  Article,
  ArticleCreateAttributes,
  ArticleUpdateAttributes,
} from '../../domains/article';
import { ArticleModelCtor } from '../../infrastructures/mysql/models/articles';

const getModel = (): ArticleModelCtor =>
  ctx.stores.main.models.articles as ArticleModelCtor;

export const findOneById = async (id: string): Promise<Article | null> => {
  const model = getModel();
  const doc = await model.findByPk(id);
  return doc ? (doc.toJSON() as Article) : null;
};

export const find = async (
  conditions: WhereOptions<Article> = {},
  sort: string[] | null = null,
  options: FindOptions<Article> = {}
): Promise<Article[]> => {
  const model = getModel();
  options.where = normalizeMysqlFilterQuery(conditions);
  options.order = getMysqlSortOptions(sort);
  const docs = await model.findAll(options);
  return docs.map((doc) => doc.toJSON() as Article);
};

export const findWithPager = async (
  conditions: WhereOptions<Article> = {},
  size?: number,
  page?: number,
  sort: string[] | null = null
): Promise<ListWithPager<Article>> => {
  const model = getModel();
  const options = getMysqlFindOptions(size, page);
  options.where = normalizeMysqlFilterQuery(conditions);
  options.order = getMysqlSortOptions(sort);
  const result = await model.findAndCountAll(options);
  return {
    ...getPagerResults(result.count, size, page),
    list: result.rows.map((doc) => doc.toJSON() as Article),
  };
};

export const findOne = async (
  conditions: WhereOptions<Article> = {}
): Promise<Article | null> => {
  const model = getModel();
  const doc = await model.findOne({
    where: normalizeMysqlFilterQuery(conditions),
  });
  return doc ? (doc.toJSON() as Article) : null;
};

export const count = async (
  conditions: WhereOptions<Article> = {}
): Promise<number> => {
  const model = getModel();
  return await model.count({ where: normalizeMysqlFilterQuery(conditions) });
};

export const createOne = async (
  obj: ArticleCreateAttributes
): Promise<Article> => {
  const model = getModel();
  const doc = await model.create(obj);
  return doc.toJSON() as Article;
};

export const updateOneById = async (
  id: string,
  obj: ArticleUpdateAttributes
): Promise<void> => {
  const model = getModel();
  await model.update(obj, { where: { id } });
};

export const removeOneById = async (id: string): Promise<void> => {
  const model = getModel();
  await model.destroy({ where: { id } });
};
