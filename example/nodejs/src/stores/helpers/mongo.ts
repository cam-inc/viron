import { QueryOptions } from 'mongoose';
import { DEFAULT_PAGER_SIZE, DEFAULT_PAGER_PAGE } from '@viron/lib';

// クエリ用のオプションを生成
export const getQueryOptions = (
  size: number = DEFAULT_PAGER_SIZE,
  page: number = DEFAULT_PAGER_PAGE
): QueryOptions => {
  return {
    limit: size,
    skip: (page - 1) * size,
  };
};
