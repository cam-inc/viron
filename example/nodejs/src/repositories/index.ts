import {
  FilterQuery as MongoFilterQuery,
  QueryOptions as MongoQueryOptions,
} from 'mongoose';
import {
  FindOptions as MysqlFindOptions,
  WhereOptions as MysqlWhereOptions,
} from 'sequelize/types';
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
import {
  Purchase,
  PurchaseCreateAttributes,
  PurchaseUpdateAttributes,
} from '../domains/purchase';
import { MODE_MONGO, MODE_MYSQL } from '../constants';

export type FindConditions<Entity> =
  | MongoFilterQuery<Entity>
  | MysqlWhereOptions<Entity>;

export type FindOptions<Entity> = MongoQueryOptions | MysqlFindOptions<Entity>;

interface Repository<Entity, CreateAttributes, UpdateAttributes> {
  findOneById: (id: string) => Promise<Entity | null>;
  find: (
    conditions?: FindConditions<Entity>,
    options?: FindOptions<Entity>
  ) => Promise<Entity[]>;
  findWithPager: (
    conditions?: FindConditions<Entity>,
    size?: number,
    page?: number
  ) => Promise<ListWithPager<Entity>>;
  findOne: (conditions?: FindConditions<Entity>) => Promise<Entity>;
  count: (conditions?: FindConditions<Entity>) => Promise<number>;
  createOne: (obj: CreateAttributes) => Promise<Entity>;
  updateOneById: (id: string, obj: UpdateAttributes) => Promise<void>;
  removeOneById: (id: string) => Promise<void>;
}

export type RepositoryNames = keyof typeof mongoRepositories &
  keyof typeof mysqlRepositories;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRepository = (name: RepositoryNames): any => {
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

export const getPurchaseRepository = (): Repository<
  Purchase,
  PurchaseCreateAttributes,
  PurchaseUpdateAttributes
> => getRepository('purchases');
