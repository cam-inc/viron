import { TABLE_SORT_DELIMITER, TABLE_SORT_ORDER } from '@viron/lib';
import { getRepository, RepositoryNames } from '../repositories';

// データエクスポート
export const exportResources = async (
  resourceName: string,
  format: 'json' | 'csv',
  size?: number,
  page?: number,
  sort = [`createdAt${TABLE_SORT_DELIMITER}${TABLE_SORT_ORDER.DESC}`]
  // eslint-disable-next-line @typescript-eslint/ban-types
): Promise<object | string> => {
  const repository = getRepository(resourceName as RepositoryNames);
  if (!repository) {
    return format === 'json' ? {} : '';
  }

  const result = await repository.findWithPager({}, size, page, sort);
  switch (format) {
    case 'csv': {
      if (!result.list.length) {
        return '';
      }
      const headers = Object.keys(result.list[0]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return result.list.reduce((ret: string, doc: any) => {
        const line: unknown[] = [];
        Object.entries(doc).forEach(([k, v]) => {
          line[headers.indexOf(k)] = v;
        });
        return ret + `\n${line.join(',')}`;
      }, headers.join(','));
    }
    default:
      return result.list;
  }
};
