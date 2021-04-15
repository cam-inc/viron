import { FindOptions } from 'sequelize/types';
import { DEFAULT_PAGER_LIMIT, DEFAULT_PAGER_OFFSET } from '@viron/lib';

export const getFindOptions = (
  limit: number = DEFAULT_PAGER_LIMIT,
  offset: number = DEFAULT_PAGER_OFFSET
): FindOptions => {
  return { limit, offset };
};
