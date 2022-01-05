import { FindOptions, Op, Sequelize, WhereOptions } from 'sequelize';
import { AdminUserModelCtor } from '../../infrastructures/mysql/models/adminusers';
import { domainsAdminUser } from '../../domains';
import {
  getMysqlFindOptions,
  getMysqlSortOptions,
  getPagerResults,
  ListWithPager,
  normalizeMysqlFilterQuery,
} from '../../helpers';
import { repositoryContainer } from '..';

type WhereOptionsWithUserIds = WhereOptions<domainsAdminUser.AdminUser> & {
  userIds?: string[];
};

const getModel = (): AdminUserModelCtor => {
  const conn = repositoryContainer.conn as Sequelize;
  return conn.models.adminusers as AdminUserModelCtor;
};

const convertConditions = (
  conditions: WhereOptionsWithUserIds
): WhereOptions<domainsAdminUser.AdminUser> => {
  if (!conditions.userIds) {
    return conditions;
  }
  conditions = Object.assign({}, { id: { [Op.in]: conditions.userIds } });
  delete conditions.userIds;
  return conditions;
};

export const findOneById = async (
  id: string
): Promise<domainsAdminUser.AdminUser | null> => {
  const model = getModel();
  const doc = await model.findByPk(id);
  return doc ? (doc.toJSON() as domainsAdminUser.AdminUser) : null;
};

export const find = async (
  conditions: WhereOptionsWithUserIds = {},
  sort: string[] | null = null,
  options: FindOptions<domainsAdminUser.AdminUser> = {}
): Promise<domainsAdminUser.AdminUser[]> => {
  const model = getModel();
  options.where = normalizeMysqlFilterQuery(convertConditions(conditions));
  options.order = getMysqlSortOptions(sort);
  const docs = await model.findAll(options);
  return docs.map((doc) => doc.toJSON() as domainsAdminUser.AdminUser);
};

export const findWithPager = async (
  conditions: WhereOptionsWithUserIds = {},
  size?: number,
  page?: number,
  sort: string[] | null = null
): Promise<ListWithPager<domainsAdminUser.AdminUser>> => {
  const model = getModel();
  const options = getMysqlFindOptions(size, page);
  options.where = normalizeMysqlFilterQuery(convertConditions(conditions));
  options.order = getMysqlSortOptions(sort);
  const result = await model.findAndCountAll(options);
  return {
    ...getPagerResults(result.count, size, page),
    list: result.rows.map((doc) => doc.toJSON() as domainsAdminUser.AdminUser),
  };
};

export const findOne = async (
  conditions: WhereOptions<domainsAdminUser.AdminUser> = {}
): Promise<domainsAdminUser.AdminUser | null> => {
  const model = getModel();
  const doc = await model.findOne({
    where: normalizeMysqlFilterQuery(conditions),
  });
  return doc ? (doc.toJSON() as domainsAdminUser.AdminUser) : null;
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
  obj: domainsAdminUser.AdminUserCreateAttributes
): Promise<domainsAdminUser.AdminUser> => {
  const model = getModel();
  const doc = await model.create(obj);
  return doc.toJSON() as domainsAdminUser.AdminUser;
};

export const updateOneById = async (
  id: string,
  obj: domainsAdminUser.AdminUserUpdateAttributes
): Promise<void> => {
  const model = getModel();
  await model.update(obj, { where: { id } });
};

export const removeOneById = async (id: string): Promise<void> => {
  const model = getModel();
  await model.destroy({ where: { id } });
};
