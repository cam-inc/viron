import {
  QueryOptions as MongoQueryOptions,
  FilterQuery as MongoFilterQuery,
} from 'mongoose';
import {
  FindOptions as MysqlFindOptions,
  Order as MysqlOrder,
  WhereOptions as MysqlWhereOptions,
} from 'sequelize';
import {
  DEFAULT_PAGER_SIZE,
  DEFAULT_PAGER_PAGE,
  TABLE_SORT_DELIMITER,
} from '../constants';

const parseSort = (str: string): [string, string] => {
  const lastIndex = str.lastIndexOf(TABLE_SORT_DELIMITER);
  return [str.slice(0, lastIndex), str.slice(lastIndex + 1)];
};

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

// Mongo: ソート用のオプションを生成
export type MongoOrder = Record<string, 1 | -1>;
export const getMongoSortOptions = (
  sort: string[] | null
): MongoOrder | undefined => {
  if (!sort) {
    return;
  }
  const order = sort.reduce((acc: MongoOrder, str) => {
    const [key, value] = parseSort(str);
    acc[key] = value.toLocaleLowerCase() === 'desc' ? -1 : 1;
    return acc;
  }, {});
  if (!order._id) {
    order._id = -1;
  }
  return order;
};

// Mongo: フィルタクエリからundefinedを除外
export const normalizeMongoFilterQuery = <T>(
  query: MongoFilterQuery<T>
): MongoFilterQuery<T> => {
  return Object.entries(query).reduce(
    (acc: MongoFilterQuery<T>, [key, val]) => {
      if (val !== undefined) {
        Object.assign(acc, { [key]: val });
      }
      return acc;
    },
    {}
  );
};

// Mysql: クエリ用のオプションを生成
export const getMysqlFindOptions = (
  size: number = DEFAULT_PAGER_SIZE,
  page: number = DEFAULT_PAGER_PAGE
): MysqlFindOptions => {
  return {
    limit: size,
    offset: (page - 1) * size,
  };
};

// Mysql: ソート用のオプションを生成
export const getMysqlSortOptions = (
  sort: string[] | null
): MysqlOrder | undefined => {
  if (!sort) {
    return;
  }
  return sort.map((str) => {
    const [key, value] = parseSort(str);
    return [key, value.toUpperCase()];
  });
};

// Mysql: フィルタクエリからundefinedを除外
export const normalizeMysqlFilterQuery = <T>(
  query: MysqlWhereOptions<T>
): MysqlWhereOptions<T> => {
  return Object.entries(query).reduce(
    (acc: MysqlWhereOptions<T>, [key, val]) => {
      if (val !== undefined) {
        Object.assign(acc, { [key]: val });
      }
      return acc;
    },
    {}
  );
};
