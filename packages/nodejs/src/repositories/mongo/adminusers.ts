import { Connection, FilterQuery, QueryOptions } from 'mongoose';
import { storeDefinitions } from '../../stores';
import { domainsAdminUser } from '../../domains';
import {
  getMongoQueryOptions,
  getMongoSortOptions,
  getPagerResults,
  ListWithPager,
  normalizeMongoFilterQuery,
} from '../../helpers';
import { repositoryContainer } from '..';

type FilterQueryWithUserIds = FilterQuery<domainsAdminUser.AdminUser> & {
  userIds?: string[];
};

const getModel = (): storeDefinitions.mongo.adminUsers.AdminUserModel => {
  const conn = repositoryContainer.conn as Connection;
  return conn.models
    .adminusers as storeDefinitions.mongo.adminUsers.AdminUserModel;
};

const convertConditions = (
  conditions: FilterQueryWithUserIds
): FilterQuery<domainsAdminUser.AdminUser> => {
  if (!conditions.userIds) {
    return conditions;
  }
  conditions = Object.assign({}, { id: { $in: conditions.userIds } });
  delete conditions.userIds;
  return conditions;
};

export const findOneById = async (
  id: string
): Promise<domainsAdminUser.AdminUser | null> => {
  const model = getModel();
  const doc = await model.findById(id);
  return doc ? doc.toJSON() : null;
};

export const find = async (
  conditions: FilterQueryWithUserIds = {},
  sort: string[] | null = null,
  options?: QueryOptions
): Promise<domainsAdminUser.AdminUser[]> => {
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
  conditions: FilterQueryWithUserIds = {},
  size?: number,
  page?: number,
  sort: string[] | null = null
): Promise<ListWithPager<domainsAdminUser.AdminUser>> => {
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
  conditions: FilterQuery<domainsAdminUser.AdminUser> = {}
): Promise<domainsAdminUser.AdminUser | null> => {
  const model = getModel();
  const doc = await model.findOne(normalizeMongoFilterQuery(conditions));
  return doc ? doc.toJSON() : null;
};

export const count = async (
  conditions: FilterQueryWithUserIds = {}
): Promise<number> => {
  const model = getModel();
  return await model.countDocuments(
    normalizeMongoFilterQuery(convertConditions(conditions))
  );
};

export const createOne = async (
  obj: domainsAdminUser.AdminUserCreateAttributes
): Promise<domainsAdminUser.AdminUser> => {
  const model = getModel();
  const doc = await model.create(obj);
  return doc.toJSON();
};

export const updateOneById = async (
  id: string,
  obj: domainsAdminUser.AdminUserUpdateAttributes
): Promise<void> => {
  const model = getModel();
  await model.updateOne({ _id: id }, obj);
};

export const removeOneById = async (id: string): Promise<void> => {
  const model = getModel();
  await model.deleteOne({ _id: id });
};
