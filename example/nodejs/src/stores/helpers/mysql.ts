import { FindOptions } from 'sequelize/types';
import { DEFAULT_PAGER_SIZE, DEFAULT_PAGER_PAGE } from '@viron/lib';

export const getFindOptions = (
  size: number = DEFAULT_PAGER_PAGE,
  page: number = DEFAULT_PAGER_SIZE
): FindOptions => {
  return {
    limit: size,
    offset: (page - 1) * size,
  };
};
