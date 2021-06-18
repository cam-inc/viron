import { ListWithPager } from '@viron/lib';
import { getUserRepository } from '../repositories';

export interface User {
  id: string;
  name: string | null;
  nickName: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface UserView extends User {
  userId: string; // alias to id
}

export interface UserCreateAttributes {
  name: string | null;
  nickName: string | null;
}

export interface UserUpdateAttributes {
  name?: string | null;
  nickName?: string | null;
}

const format = (user: User): UserView => {
  return Object.assign({}, user, { userId: user.id });
};

export const list = async (
  // TODO: conditions
  limit?: number,
  offset?: number
): Promise<ListWithPager<UserView>> => {
  const repository = getUserRepository();
  const result = await repository.findWithPager({}, limit, offset);
  return {
    ...result,
    list: result.list.map(format),
  };
};

export const createOne = async (
  payload: UserCreateAttributes
): Promise<UserView> => {
  const repository = getUserRepository();
  const user = await repository.createOne(payload);
  return format(user);
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
