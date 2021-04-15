import { FilterQuery, QueryOptions } from 'mongoose';
import { ListWithPager, getPagerResults } from '@viron/lib';
import {
  User,
  UserCreateAttributes,
  UserUpdateAttributes,
} from '../../domains/user';
import { UserModel } from '../../stores/definitions/mongo/users';
import { getQueryOptions } from '../../stores/helpers/mongo';
import { ctx } from '../../context';

const getModel = (): UserModel =>
  ctx.stores.main.models.users.Model as UserModel;

export const findOneById = async (id: string): Promise<User | null> => {
  const model = getModel();
  const doc = await model.findById(id);
  return doc ? doc.toJSON() : null;
};

export const find = async (
  conditions: FilterQuery<User> = {},
  options?: QueryOptions
): Promise<User[]> => {
  const model = getModel();
  const docs = await model.find(conditions, null, options);
  return docs.map((doc) => doc.toJSON());
};

export const findWithPager = async (
  conditions: FilterQuery<User> = {},
  limit?: number,
  offset?: number
): Promise<ListWithPager<User>> => {
  const options = getQueryOptions(limit, offset);
  const [list, totalCount] = await Promise.all([
    find(conditions, options),
    count(conditions),
  ]);
  return {
    ...getPagerResults(totalCount),
    list,
  };
};

export const count = async (
  conditions: FilterQuery<User> = {}
): Promise<number> => {
  const model = getModel();
  return await model.countDocuments(conditions);
};

export const createOne = async (obj: UserCreateAttributes): Promise<User> => {
  const model = getModel();
  const doc = await model.create(obj);
  return doc.toJSON();
};

export const updateOneById = async (
  id: string,
  obj: UserUpdateAttributes
): Promise<void> => {
  const model = getModel();

  await model.updateOne({ _id: id }, obj);
};

export const removeOneById = async (id: string): Promise<void> => {
  const model = getModel();
  await model.deleteOne({ _id: id });
};
