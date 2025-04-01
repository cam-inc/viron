import { FindOptions, Op, Sequelize, WhereOptions } from 'sequelize';
import { AdminUserSsoTokenModelStatic } from '../../infrastructures/mysql/models/adminuserssotokens';
import { domainsAdminUserSsoToken } from '../../domains';
import {
  getMysqlFindOptions,
  getMysqlSortOptions,
  getPagerResults,
  ListWithPager,
  normalizeMysqlFilterQuery,
} from '../../helpers';
import { repositoryContainer } from '..';

type WhereOptionsWithUserIds =
  WhereOptions<domainsAdminUserSsoToken.AdminUserSsoToken> & {
    userIds?: string[];
  };

const getModel = (): AdminUserSsoTokenModelStatic => {
  const conn = repositoryContainer.conn as Sequelize;
  return conn.models.adminuserssotokens as AdminUserSsoTokenModelStatic;
};

const convertConditions = (
  conditions: WhereOptionsWithUserIds
): WhereOptions<domainsAdminUserSsoToken.AdminUserSsoToken> => {
  if (!conditions.userIds) {
    return conditions;
  }
  conditions = Object.assign({}, { id: { [Op.in]: conditions.userIds } });
  delete conditions.userIds;
  return conditions;
};

export const findOneById = async (
  id: string
): Promise<domainsAdminUserSsoToken.AdminUserSsoToken | null> => {
  const model = getModel();
  const doc = await model.findByPk(id);
  return doc
    ? (doc.toJSON() as domainsAdminUserSsoToken.AdminUserSsoToken)
    : null;
};

export const find = async (
  conditions: WhereOptionsWithUserIds = {},
  sort: string[] | null = null,
  options: FindOptions<domainsAdminUserSsoToken.AdminUserSsoToken> = {}
): Promise<domainsAdminUserSsoToken.AdminUserSsoToken[]> => {
  const model = getModel();
  options.where = normalizeMysqlFilterQuery(convertConditions(conditions));
  options.order = getMysqlSortOptions(sort);
  const docs = await model.findAll(options);
  return docs.map(
    (doc) => doc.toJSON() as domainsAdminUserSsoToken.AdminUserSsoToken
  );
};

export const findWithPager = async (
  conditions: WhereOptionsWithUserIds = {},
  size?: number,
  page?: number,
  sort: string[] | null = null
): Promise<ListWithPager<domainsAdminUserSsoToken.AdminUserSsoToken>> => {
  const model = getModel();
  const options = getMysqlFindOptions(size, page);
  options.where = normalizeMysqlFilterQuery(convertConditions(conditions));
  options.order = getMysqlSortOptions(sort);
  const result = await model.findAndCountAll(options);
  return {
    ...getPagerResults(result.count, size, page),
    list: result.rows.map(
      (doc) => doc.toJSON() as domainsAdminUserSsoToken.AdminUserSsoToken
    ),
  };
};

export const findOne = async (
  conditions: WhereOptions<domainsAdminUserSsoToken.AdminUserSsoToken> = {}
): Promise<domainsAdminUserSsoToken.AdminUserSsoToken | null> => {
  const model = getModel();
  const doc = await model.findOne({
    where: normalizeMysqlFilterQuery(conditions),
  });
  return doc
    ? (doc.toJSON() as domainsAdminUserSsoToken.AdminUserSsoToken)
    : null;
};

export const count = async (
  conditions: WhereOptionsWithUserIds = {}
): Promise<number> => {
  const model = getModel();
  return await model.count({
    where: normalizeMysqlFilterQuery(convertConditions(conditions)),
  });
};

export const createOne = async (
  obj: domainsAdminUserSsoToken.AdminUserSsoTokenCreateAttributes
): Promise<domainsAdminUserSsoToken.AdminUserSsoToken> => {
  const model = getModel();
  const doc = await model.create(obj);
  return doc.toJSON() as domainsAdminUserSsoToken.AdminUserSsoToken;
};

export const updateOneById = async (
  id: string,
  obj: domainsAdminUserSsoToken.AdminUserSsoTokenUpdateAttributes
): Promise<void> => {
  const model = getModel();
  await model.update(obj, { where: { id } });
};

export const removeOneById = async (id: string): Promise<void> => {
  const model = getModel();
  await model.destroy({ where: { id } });
};
