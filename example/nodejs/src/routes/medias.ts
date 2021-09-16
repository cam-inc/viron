import { RouteContext } from '../application';
import { list, createOne, removeOneById } from '../domains/media';

// メディア一覧
export const listMedias = async (context: RouteContext): Promise<void> => {
  const { size, page, sort, mediaId } = context.params.query;
  const conditions = mediaId ? { id: mediaId } : {};
  const result = await list(conditions, size, page, sort);
  context.res.json(result);
};

// メディア作成
export const createMedia = async (context: RouteContext): Promise<void> => {
  const requestBody = {
    name: context.requestBody.name,
    url: context.requestBody.uploadData,
    mimeType: context.req.file.mimetype,
  };
  const media = await createOne(requestBody);
  context.res.status(201).json(media);
};

// メディア削除
export const removeMedia = async (context: RouteContext): Promise<void> => {
  await removeOneById(context.params.path.mediaId);
  context.res.status(204).end();
};
