import { DEFAULT_PAGER_SIZE, DEFAULT_PAGER_PAGE } from '../constants';

export interface PagerResults {
  currentPage: number;
  maxPage: number;
}

export interface ListWithPager<T> extends PagerResults {
  list: T[];
}

// 最大ページ数と現在のページ番号を取得
export const getPagerResults = (
  numberOfList: number,
  size = DEFAULT_PAGER_SIZE,
  page = DEFAULT_PAGER_PAGE
): PagerResults => {
  const maxPage =
    numberOfList > 0 ? Math.ceil(numberOfList / size) : DEFAULT_PAGER_PAGE;
  const currentPage = page;
  return { maxPage, currentPage };
};

// listをページングする
export const paging = <T>(
  list: T[],
  size = DEFAULT_PAGER_SIZE,
  page = DEFAULT_PAGER_PAGE
): ListWithPager<T> => {
  const start = size * (page - 1);
  return {
    ...getPagerResults(list.length, size, page),
    list: list.slice(start, start + size),
  };
};
