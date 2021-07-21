import { FilterQuery, QueryOptions } from 'mongoose';
import {
  ListWithPager,
  getPagerResults,
  getMongoQueryOptions,
  getMongoSortOptions,
  normalizeMongoFilterQuery,
} from '@viron/lib';
import {
  User,
  UserCreateAttributes,
  UserUpdateAttributes,
} from '../../domains/user';
import { UserModel } from '../../stores/definitions/mongo/users';
import { ctx } from '../../context';

const getModel = (): UserModel => ctx.stores.main.models.users as UserModel;

export const findOneById = async (id: string): Promise<User | null> => {
  const model = getModel();
  const doc = await model.findById(id);
  return doc ? doc.toJSON() : null;
};

export const find = async (
  conditions: FilterQuery<User> = {},
  sort: string[] | null = null,
  options?: QueryOptions
): Promise<User[]> => {
  const model = getModel();
  options = options ?? {};
  options.sort = getMongoSortOptions(sort);
  const docs = await model.find(
    normalizeMongoFilterQuery(conditions),
    null,
    options
  );
  return docs.map((doc) => doc.toJSON());
};

export const findWithPager = async (
  conditions: FilterQuery<User> = {},
  size?: number,
  page?: number,
  sort: string[] | null = null
): Promise<ListWithPager<User>> => {
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
  conditions: FilterQuery<User> = {}
): Promise<User | null> => {
  const model = getModel();
  const doc = await model.findOne(normalizeMongoFilterQuery(conditions));
  return doc ? doc.toJSON() : null;
};

export const count = async (
  conditions: FilterQuery<User> = {}
): Promise<number> => {
  const model = getModel();
  return await model.countDocuments(normalizeMongoFilterQuery(conditions));
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
