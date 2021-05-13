import { FilterQuery, QueryOptions } from 'mongoose';
import { FindOptions, WhereOptions } from 'sequelize/types';
import { ListWithPager } from '@viron/lib';
import { noSetEnvMode } from '../errors';
import { ctx } from '../context';
import * as mongoRepositories from './mongo';
import * as mysqlRepositories from './mysql';
import {
  User,
  UserCreateAttributes,
  UserUpdateAttributes,
} from '../domains/user';
import { MODE_MONGO, MODE_MYSQL } from '../constants';

interface Repository<Entity, CreateAttributes, UpdateAttributes> {
  findOneById: (id: string) => Promise<Entity | null>;
  find: (
    conditions?: FilterQuery<Entity> | WhereOptions<Entity>,
    options?: QueryOptions | FindOptions<Entity>
  ) => Promise<Entity[]>;
  findWithPager: (
    conditions?: FilterQuery<Entity> | FindOptions<Entity>,
    limit?: number,
    offset?: number
  ) => Promise<ListWithPager<Entity>>;
  count: (
    conditions?: FilterQuery<Entity> | FindOptions<Entity>
  ) => Promise<number>;
  createOne: (obj: CreateAttributes) => Promise<Entity>;
  updateOneById: (id: string, obj: UpdateAttributes) => Promise<void>;
  removeOneById: (id: string) => Promise<void>;
}

type Names = keyof typeof mongoRepositories & keyof typeof mysqlRepositories;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRepository = (name: Names): any => {
  switch (ctx.mode) {
    case MODE_MONGO:
      return mongoRepositories[name];
    case MODE_MYSQL:
      return mysqlRepositories[name];
    default:
      throw noSetEnvMode();
  }
};

export const getUserRepository = (): Repository<
  User,
  UserCreateAttributes,
  UserUpdateAttributes
> => getRepository('users');
