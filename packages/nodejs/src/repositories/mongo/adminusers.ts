import { Connection, FilterQuery } from 'mongoose';
import { storeDefinitions } from '../../stores';
import { domainsAdminUser } from '../../domains';
import { getPagerResults, ListWithPager } from '../../helpers';
import { repositoryContainer } from '..';

const getModel = (): storeDefinitions.mongo.adminUsers.AdminUserModel => {
  const conn = repositoryContainer.conn as Connection;
  return conn.models
    .adminusers as storeDefinitions.mongo.adminUsers.AdminUserModel;
};

export const findOneById = async (
  id: string
): Promise<domainsAdminUser.AdminUser | null> => {
  const model = getModel();
  const doc = await model.findById(id);
  return doc ? doc.toJSON() : null;
};

export const find = async (): Promise<domainsAdminUser.AdminUser[]> => {
  const model = getModel();
  const docs = await model.find();
  return docs.map((doc) => doc.toJSON());
};

export const findWithPager = async (): Promise<
  ListWithPager<domainsAdminUser.AdminUser>
> => {
  const [list, totalCount] = await Promise.all([find(), count()]);
  return {
    ...getPagerResults(totalCount),
    list,
  };
};

export const findOne = async (
  conditions: FilterQuery<domainsAdminUser.AdminUser> = {}
): Promise<domainsAdminUser.AdminUser | null> => {
  const model = getModel();
  const doc = await model.findOne(conditions);
  return doc ? doc.toJSON() : null;
};

export const count =
  async (/*conditions: FilterQuery<domainsAuditLog.AuditLog> = {}*/): Promise<number> => {
    const model = getModel();
    return await model.countDocuments();
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
