import { Connection, FilterQuery, QueryOptions } from 'mongoose';
import {
  AdminUserSsoTokenDocument,
  AdminUserSsoTokenModel,
} from '../../infrastructures/mongo/models/adminuserssotokens';
import { domainsAdminUserSsoToken } from '../../domains';
import {
  getMongoQueryOptions,
  getMongoSortOptions,
  getPagerResults,
  ListWithPager,
  normalizeMongoFilterQuery,
} from '../../helpers';
import { repositoryContainer } from '..';

type FilterQueryWithUserIds = FilterQuery<AdminUserSsoTokenDocument> & {
  userIds?: string[];
};

const getModel = (): AdminUserSsoTokenModel => {
  const conn = repositoryContainer.conn as Connection;
  return conn.models.adminuserssotokens as AdminUserSsoTokenModel;
};

const convertConditions = (
  conditions: FilterQueryWithUserIds
): FilterQuery<AdminUserSsoTokenDocument> => {
  if (conditions.id) {
    conditions._id = conditions.id;
    delete conditions.id;
  }
  if (!conditions.userIds) {
    return conditions;
  }
  conditions = Object.assign({}, { _id: { $in: conditions.userIds } });
  delete conditions.userIds;
  return conditions;
};

export const findOneById = async (
  id: string
): Promise<domainsAdminUserSsoToken.AdminUserSsoToken | null> => {
  const model = getModel();
  const doc = await model.findById(id);
  return doc ? doc.toJSON() : null;
};

export const find = async (
  conditions: FilterQueryWithUserIds = {},
  sort: string[] | null = null,
  options?: QueryOptions
): Promise<domainsAdminUserSsoToken.AdminUserSsoToken[]> => {
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
): Promise<ListWithPager<domainsAdminUserSsoToken.AdminUserSsoToken>> => {
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
  conditions: FilterQuery<AdminUserSsoTokenDocument> = {}
): Promise<domainsAdminUserSsoToken.AdminUserSsoToken | null> => {
  const model = getModel();
  const doc = await model.findOne(
    normalizeMongoFilterQuery(convertConditions(conditions))
  );
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
  obj: domainsAdminUserSsoToken.AdminUserSsoTokenCreateAttributes
): Promise<domainsAdminUserSsoToken.AdminUserSsoToken> => {
  const model = getModel();
  const doc = await model.create(obj);
  return doc.toJSON();
};

export const updateOneById = async (
  id: string,
  obj: domainsAdminUserSsoToken.AdminUserSsoTokenUpdateAttributes
): Promise<void> => {
  const model = getModel();
  await model.updateOne({ _id: id }, obj);
};

export const removeOneById = async (id: string): Promise<void> => {
  const model = getModel();
  await model.deleteOne({ _id: id });
};
