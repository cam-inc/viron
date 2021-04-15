import { QueryOptions } from 'mongoose';
import { DEFAULT_PAGER_LIMIT, DEFAULT_PAGER_OFFSET } from '@viron/lib';

// クエリ用のオプションを生成
export const getQueryOptions = (
  limit: number = DEFAULT_PAGER_LIMIT,
  offset: number = DEFAULT_PAGER_OFFSET
): QueryOptions => {
  return {
    limit: limit,
    skip: offset,
  };
};
