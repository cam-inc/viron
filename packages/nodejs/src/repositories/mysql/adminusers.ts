import { Op, Sequelize } from 'sequelize';
import { FindOptions, WhereOptions } from 'sequelize/types';
import { storeDefinitions } from '../../stores';
import { domainsAdminUser } from '../../domains';
import {
  getMysqlFindOptions,
  getPagerResults,
  ListWithPager,
} from '../../helpers';
import { repositoryContainer } from '..';

type WhereOptionsWithUserIds = WhereOptions<domainsAdminUser.AdminUser> & {
  userIds?: string[];
};

const getModel = (): storeDefinitions.mysql.adminUsers.AdminUserModelCtor => {
  const conn = repositoryContainer.conn as Sequelize;
  return conn.models
    .auditlogs as storeDefinitions.mysql.adminUsers.AdminUserModelCtor;
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
  options: FindOptions<domainsAdminUser.AdminUser> = {}
): Promise<domainsAdminUser.AdminUser[]> => {
  const model = getModel();
  options.where = convertConditions(conditions);
  const docs = await model.findAll(options);
  return docs.map((doc) => doc.toJSON() as domainsAdminUser.AdminUser);
};

export const findWithPager = async (
  conditions: WhereOptionsWithUserIds = {},
  size?: number,
  page?: number
): Promise<ListWithPager<domainsAdminUser.AdminUser>> => {
  const model = getModel();
  const options = getMysqlFindOptions(size, page);
  options.where = convertConditions(conditions);
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
  const doc = await model.findOne({ where: conditions });
  return doc ? (doc.toJSON() as domainsAdminUser.AdminUser) : null;
};

export const count = async (
  conditions: WhereOptionsWithUserIds = {}
): Promise<number> => {
  const model = getModel();
  return await model.count({ where: convertConditions(conditions) });
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
