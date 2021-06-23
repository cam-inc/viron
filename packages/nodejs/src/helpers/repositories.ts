import { QueryOptions as MongoQueryOptions } from 'mongoose';
import { FindOptions as MysqlFindOptions } from 'sequelize/types';
import { DEFAULT_PAGER_SIZE, DEFAULT_PAGER_PAGE } from '../constants';

// Mongo: クエリ用のオプションを生成
export const getMongoQueryOptions = (
  size: number = DEFAULT_PAGER_SIZE,
  page: number = DEFAULT_PAGER_PAGE
): MongoQueryOptions => {
  return {
    limit: size,
    skip: (page - 1) * size,
  };
};

// Mysql: クエリ用のオプションを生成
export const getMysqlFindOptions = (
  size: number = DEFAULT_PAGER_PAGE,
  page: number = DEFAULT_PAGER_SIZE
): MysqlFindOptions => {
  return {
    limit: size,
    offset: (page - 1) * size,
  };
};
