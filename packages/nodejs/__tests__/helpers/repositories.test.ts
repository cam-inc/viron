import {
  getMongoQueryOptions,
  getMongoSortOptions,
  normalizeMongoFilterQuery,
  getMysqlFindOptions,
  getMysqlSortOptions,
  normalizeMysqlFilterQuery,
} from '../../src/helpers/repositories';
import { DEFAULT_PAGER_SIZE, DEFAULT_PAGER_PAGE } from '../../src/constants';

describe('MongoDB Helpers', () => {
  test('getMongoQueryOptions should return correct options', () => {
    const options = getMongoQueryOptions();
    expect(options).toEqual({
      limit: DEFAULT_PAGER_SIZE,
      skip: (DEFAULT_PAGER_PAGE - 1) * DEFAULT_PAGER_SIZE,
    });
  });

  test('getMongoQueryOptions should return correct options with custom size and page', () => {
    const options = getMongoQueryOptions(20, 2);
    expect(options).toEqual({ limit: 20, skip: 20 });
  });

  test('getMongoSortOptions should return correct sort options', () => {
    const sortOptions = getMongoSortOptions(['name:asc', 'age:desc']);
    expect(sortOptions).toEqual({ name: 1, age: -1, _id: -1 });
  });

  test('getMongoSortOptions should return undefined for null input', () => {
    const sortOptions = getMongoSortOptions(null);
    expect(sortOptions).toBeUndefined();
  });

  test('normalizeMongoFilterQuery should remove undefined values', () => {
    const query = { name: 'John', age: undefined };
    const normalizedQuery = normalizeMongoFilterQuery(query);
    expect(normalizedQuery).toEqual({ name: 'John' });
  });

  test('normalizeMongoFilterQuery should return empty object for empty input', () => {
    const query = {};
    const normalizedQuery = normalizeMongoFilterQuery(query);
    expect(normalizedQuery).toEqual({});
  });
});

describe('MySQL Helpers', () => {
  test('getMysqlFindOptions should return correct options', () => {
    const options = getMysqlFindOptions();
    expect(options).toEqual({
      limit: DEFAULT_PAGER_SIZE,
      offset: (DEFAULT_PAGER_PAGE - 1) * DEFAULT_PAGER_SIZE,
    });
  });

  test('getMysqlFindOptions should return correct options with custom size and page', () => {
    const options = getMysqlFindOptions(20, 2);
    expect(options).toEqual({ limit: 20, offset: 20 });
  });

  test('getMysqlSortOptions should return correct sort options', () => {
    const sortOptions = getMysqlSortOptions(['name:asc', 'age:desc']);
    expect(sortOptions).toEqual([
      ['name', 'ASC'],
      ['age', 'DESC'],
    ]);
  });

  test('getMysqlSortOptions should return undefined for null input', () => {
    const sortOptions = getMysqlSortOptions(null);
    expect(sortOptions).toBeUndefined();
  });

  test('normalizeMysqlFilterQuery should remove undefined values', () => {
    const query = { name: 'John', age: undefined };
    const normalizedQuery = normalizeMysqlFilterQuery(query);
    expect(normalizedQuery).toEqual({ name: 'John' });
  });

  test('normalizeMysqlFilterQuery should return empty object for empty input', () => {
    const query = {};
    const normalizedQuery = normalizeMysqlFilterQuery(query);
    expect(normalizedQuery).toEqual({});
  });
});
