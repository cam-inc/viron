import { Sequelize } from 'sequelize';
import { WhereOptions } from 'sequelize/types';
import { storeDefinitions } from '../../stores';
import { domainsAdminUser } from '../../domains';
import { getPagerResults, ListWithPager } from '../../helpers';
import { repositoryContainer } from '..';

const getModel = (): storeDefinitions.mysql.adminUsers.AdminUserModelCtor => {
  const conn = repositoryContainer.conn as Sequelize;
  return conn.models
    .auditlogs as storeDefinitions.mysql.adminUsers.AdminUserModelCtor;
};

export const findOneById = async (
  id: string
): Promise<domainsAdminUser.AdminUser | null> => {
  const model = getModel();
  const doc = await model.findByPk(id);
  return doc ? (doc.toJSON() as domainsAdminUser.AdminUser) : null;
};

export const find = async (): Promise<domainsAdminUser.AdminUser[]> => {
  const model = getModel();
  const docs = await model.findAll();
  return docs.map((doc) => doc.toJSON() as domainsAdminUser.AdminUser);
};
export const findWithPager = async (): Promise<
  ListWithPager<domainsAdminUser.AdminUser>
> => {
  const model = getModel();
  const result = await model.findAndCountAll();
  return {
    ...getPagerResults(result.count),
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

export const count =
  async (/*conditions: WhereOptions<User> = {}*/): Promise<number> => {
    const model = getModel();
    return await model.count();
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
