import { HTTP_HEADER } from '@viron/lib';
import { contentType } from 'mime-types';
import { RouteContext } from '../application';
import { exportResources } from '../domains/resources';

// データダウンロード
export const downloadResources = async (
  context: RouteContext
): Promise<void> => {
  const { resourceName } = context.params.path;
  const { format = 'json', size, page, sort } = context.params.query;
  const result = await exportResources(resourceName, format, size, page, sort);
  context.res.header(HTTP_HEADER.CONTENT_TYPE, contentType(format) || '');
  context.res.header(
    HTTP_HEADER.CONTENT_DISPOSITION,
    `attachment; filename="${resourceName}-${Date.now()}.${format}"`
  );
  context.res.setBody(result).end();
};
