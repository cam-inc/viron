import { FilterQuery, QueryOptions } from 'mongoose';
import {
  ListWithPager,
  getPagerResults,
  getMongoQueryOptions,
  getMongoSortOptions,
  normalizeMongoFilterQuery,
} from '@viron/lib';
import {
  Article,
  ArticleCreateAttributes,
  ArticleUpdateAttributes,
} from '../../domains/article';
import {
  ArticleModel,
  ArticleDocument,
} from '../../stores/definitions/mongo/articles';
import { ctx } from '../../context';

const getModel = (): ArticleModel =>
  ctx.stores.main.models.articles as ArticleModel;

const convertConditions = (
  conditions: FilterQuery<ArticleDocument>
): FilterQuery<ArticleDocument> => {
  if (conditions.id) {
    conditions._id = conditions.id;
    delete conditions.id;
  }
  return conditions;
};

export const findOneById = async (id: string): Promise<Article | null> => {
  const model = getModel();
  const doc = await model.findById(id);
  return doc ? doc.toJSON() : null;
};

export const find = async (
  conditions: FilterQuery<ArticleDocument> = {},
  sort: string[] | null = null,
  options?: QueryOptions
): Promise<Article[]> => {
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
  conditions: FilterQuery<ArticleDocument> = {},
  size?: number,
  page?: number,
  sort: string[] | null = null
): Promise<ListWithPager<Article>> => {
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
  conditions: FilterQuery<ArticleDocument> = {}
): Promise<Article | null> => {
  const model = getModel();
  const doc = await model.findOne(
    normalizeMongoFilterQuery(convertConditions(conditions))
  );
  return doc ? doc.toJSON() : null;
};

export const count = async (
  conditions: FilterQuery<ArticleDocument> = {}
): Promise<number> => {
  const model = getModel();
  return await model.countDocuments(
    normalizeMongoFilterQuery(convertConditions(conditions))
  );
};

export const createOne = async (
  obj: ArticleCreateAttributes
): Promise<Article> => {
  const model = getModel();
  const doc = await model.create(obj);
  return doc.toJSON();
};

export const updateOneById = async (
  id: string,
  obj: ArticleUpdateAttributes
): Promise<void> => {
  const model = getModel();
  await model.updateOne({ _id: id }, obj);
};

export const removeOneById = async (id: string): Promise<void> => {
  const model = getModel();
  await model.deleteOne({ _id: id });
};
