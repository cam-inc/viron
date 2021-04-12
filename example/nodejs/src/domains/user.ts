import { ListWithPager } from '@viron/lib';
import { getUserRepository } from '../repositories';

export interface User {
  id: string;
  name: string | null;
  nickName: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface UserCreateAttributes {
  name: string | null;
  nickName: string | null;
}

export interface UserUpdateAttributes {
  name?: string | null;
  nickName?: string | null;
}

export const list = async (
  // TODO: conditions
  limit?: number,
  offset?: number
): Promise<ListWithPager<User>> => {
  const repository = getUserRepository();
  return repository.findWithPager({}, limit, offset);
};

export const createOne = async (
  payload: UserCreateAttributes
): Promise<User> => {
  const repository = getUserRepository();
  return await repository.createOne(payload);
};

export const updateOneById = async (
  id: string,
  payload: UserUpdateAttributes
): Promise<void> => {
  const repository = getUserRepository();
  await repository.updateOneById(id, payload);
};

export const removeOneById = async (id: string): Promise<void> => {
  const repository = getUserRepository();
  await repository.removeOneById(id);
};
