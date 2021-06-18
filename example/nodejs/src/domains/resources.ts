import { getRepository, RepositoryNames } from '../repositories';

// データエクスポート
export const exportResources = async (
  resourceName: string,
  format: 'json' | 'csv'
  // eslint-disable-next-line @typescript-eslint/ban-types
): Promise<object | string> => {
  const repository = getRepository(resourceName as RepositoryNames);
  if (!repository) {
    return format === 'json' ? {} : '';
  }

  const result = await repository.find();
  switch (format) {
    case 'csv': {
      if (!result.length) {
        return '';
      }
      const headers = Object.keys(result[0]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return result.reduce((ret: string, doc: any) => {
        const line: unknown[] = [];
        Object.entries(doc).forEach(([k, v]) => {
          line[headers.indexOf(k)] = v;
        });
        return ret + `\n${line.join(',')}`;
      }, headers.join(','));
    }
    default:
      return result;
  }
};
