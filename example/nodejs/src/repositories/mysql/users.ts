import { FindOptions, WhereOptions } from 'sequelize/types';
import { getPagerResults, ListWithPager } from '@viron/lib';
import { ctx } from '../../context';
import {
  User,
  UserCreateAttributes,
  UserUpdateAttributes,
} from '../../domains/user';
import { UserModelCtor } from '../../stores/definitions/mysql/users';
import { getFindOptions } from '../../stores/helpers/mysql';

const getModel = (): UserModelCtor =>
  ctx.stores.main.models.users.Model as UserModelCtor;

export const findOneById = async (id: string): Promise<User | null> => {
  const model = getModel();
  const doc = await model.findByPk(id);
  return doc ? (doc.toJSON() as User) : null;
};

export const find = async (
  conditions: WhereOptions<User> = {},
  options: FindOptions<User> = {}
): Promise<User[]> => {
  const model = getModel();
  options.where = conditions;
  const docs = await model.findAll(options);
  return docs.map((doc) => doc.toJSON() as User);
};

export const findWithPager = async (
  conditions: WhereOptions<User> = {},
  limit?: number,
  offset?: number
): Promise<ListWithPager<User>> => {
  const model = getModel();
  const options = getFindOptions(limit, offset);
  options.where = conditions;
  const result = await model.findAndCountAll(options);
  return {
    ...getPagerResults(result.count),
    list: result.rows.map((doc) => doc.toJSON() as User),
  };
};

export const count = async (
  conditions: WhereOptions<User> = {}
): Promise<number> => {
  const model = getModel();
  return await model.count({ where: conditions });
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
