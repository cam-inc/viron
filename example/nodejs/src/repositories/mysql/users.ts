import { FindOptions, WhereOptions } from 'sequelize';
import {
  getMysqlFindOptions,
  getMysqlSortOptions,
  getPagerResults,
  ListWithPager,
  normalizeMysqlFilterQuery,
} from '@viron/lib';
import { ctx } from '../../context';
import {
  User,
  UserCreateAttributes,
  UserUpdateAttributes,
} from '../../domains/user';
import { UserModelStatic } from '../../infrastructures/mysql/models/users';

const getModel = (): UserModelStatic =>
  ctx.stores.main.models.users as UserModelStatic;

export const findOneById = async (id: string): Promise<User | null> => {
  const model = getModel();
  const doc = await model.findByPk(id);
  return doc ? (doc.toJSON() as User) : null;
};

export const find = async (
  conditions: WhereOptions<User> = {},
  sort: string[] | null = null,
  options: FindOptions<User> = {}
): Promise<User[]> => {
  const model = getModel();
  options.where = normalizeMysqlFilterQuery(conditions);
  options.order = getMysqlSortOptions(sort);
  const docs = await model.findAll(options);
  return docs.map((doc) => doc.toJSON() as User);
};

export const findWithPager = async (
  conditions: WhereOptions<User> = {},
  size?: number,
  page?: number,
  sort: string[] | null = null
): Promise<ListWithPager<User>> => {
  const model = getModel();
  const options = getMysqlFindOptions(size, page);
  options.where = normalizeMysqlFilterQuery(conditions);
  options.order = getMysqlSortOptions(sort);
  const result = await model.findAndCountAll(options);
  return {
    ...getPagerResults(result.count, size, page),
    list: result.rows.map((doc) => doc.toJSON() as User),
  };
};

export const findOne = async (
  conditions: WhereOptions<User> = {}
): Promise<User | null> => {
  const model = getModel();
  const doc = await model.findOne({
    where: normalizeMysqlFilterQuery(conditions),
  });
  return doc ? (doc.toJSON() as User) : null;
};

export const count = async (
  conditions: WhereOptions<User> = {}
): Promise<number> => {
  const model = getModel();
  return await model.count({ where: normalizeMysqlFilterQuery(conditions) });
};

export const createOne = async (obj: UserCreateAttributes): Promise<User> => {
  const model = getModel();
  const doc = await model.create(obj);
  return doc.toJSON() as User;
};

export const updateOneById = async (
  id: string,
  obj: UserUpdateAttributes
): Promise<void> => {
  const model = getModel();
  await model.update(obj, { where: { id } });
};

export const removeOneById = async (id: string): Promise<void> => {
  const model = getModel();
  await model.destroy({ where: { id } });
};
