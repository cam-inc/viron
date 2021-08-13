import { Connection, FilterQuery, QueryOptions } from 'mongoose';
import { storeDefinitions } from '../../stores';
import { domainsAuth } from '../../domains';
import { repositoryContainer } from '..';
import {
  getMongoQueryOptions,
  getMongoSortOptions,
  getPagerResults,
  ListWithPager,
  normalizeMongoFilterQuery,
} from '../../helpers';

const getModel = (): storeDefinitions.mongo.revokedTokens.RevokedTokenModel => {
  const conn = repositoryContainer.conn as Connection;
  return conn.models
    .revokedtokens as storeDefinitions.mongo.revokedTokens.RevokedTokenModel;
};

const convertConditions = (
  conditions: FilterQuery<domainsAuth.RevokedToken>
): FilterQuery<domainsAuth.RevokedToken> => {
  if (conditions.id) {
    conditions._id = conditions.id;
    delete conditions.id;
  }
  return conditions;
};

export const findOneById = async (
  id: string
): Promise<domainsAuth.RevokedToken | null> => {
  const model = getModel();
  const doc = await model.findById(id);
  return doc ? doc.toJSON() : null;
};

export const find = async (
  conditions: FilterQuery<domainsAuth.RevokedToken> = {},
  sort: string[] | null = null,
  options?: QueryOptions
): Promise<domainsAuth.RevokedToken[]> => {
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
  conditions: FilterQuery<domainsAuth.RevokedToken> = {},
  size?: number,
  page?: number,
  sort: string[] | null = null
): Promise<ListWithPager<domainsAuth.RevokedToken>> => {
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
  conditions: FilterQuery<domainsAuth.RevokedToken> = {}
): Promise<domainsAuth.RevokedToken | null> => {
  const model = getModel();
  const doc = await model.findOne(
    normalizeMongoFilterQuery(convertConditions(conditions))
  );
  return doc ? doc.toJSON() : null;
};

export const count = async (
  conditions: FilterQuery<domainsAuth.RevokedToken> = {}
): Promise<number> => {
  const model = getModel();
  return await model.countDocuments(
    normalizeMongoFilterQuery(convertConditions(conditions))
  );
};

export const createOne = async (
  auditLog: domainsAuth.RevokedTokenCreateAttributes
): Promise<domainsAuth.RevokedToken> => {
  const model = getModel();
  const doc = await model.create(auditLog);
  return doc.toJSON();
};
