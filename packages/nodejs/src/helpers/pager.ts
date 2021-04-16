import { DEFAULT_PAGER_LIMIT, DEFAULT_PAGER_OFFSET } from '../constants';

export interface PagerResults {
  currentPage: number;
  totalPages: number;
}

export interface ListWithPager<T> extends PagerResults {
  list: T[];
}

export const getPagerResults = (
  count: number,
  limit = DEFAULT_PAGER_LIMIT,
  offset = DEFAULT_PAGER_OFFSET
): PagerResults => {
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.ceil((offset + 1) / limit);
  return { totalPages, currentPage };
};
