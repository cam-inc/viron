import { ListWithPager } from '@viron/lib';
import { FindConditions, getMediaRepository } from '../repositories';

export interface Media {
  id: string;
  name: string;
  filePath: string;
  contentType: string;
  createdAt: number;
  updatedAt: number;
}

export interface MediaView extends Media {
  mediaId: string; // alias to id
}

export interface MediaCreateAttributes {
  name: string;
  filePath: string;
  contentType: string;
}

export interface MediaUpdateAttributes {
  name: string;
  filePath: string;
  contentType: string;
}

const format = (media: Media): MediaView => {
  return Object.assign({}, media, { mediaId: media.id });
};

export const list = async (
  conditions?: FindConditions<Media>,
  size?: number,
  page?: number,
  sort?: string[]
): Promise<ListWithPager<MediaView>> => {
  const repository = getMediaRepository();
  const result = await repository.findWithPager(conditions, size, page, sort);
  return {
    ...result,
    list: result.list.map(format),
  };
};

export const findOne = async (
  conditions: FindConditions<Media>
): Promise<MediaView> => {
  const repository = getMediaRepository();
  const media = await repository.findOne(conditions);
  return format(media);
};

export const createOne = async (
  payload: MediaCreateAttributes
): Promise<MediaView> => {
  const repository = getMediaRepository();
  const media = await repository.createOne(payload);
  return format(media);
};

export const updateOneById = async (
  id: string,
  payload: MediaUpdateAttributes
): Promise<void> => {
  const repository = getMediaRepository();
  await repository.updateOneById(id, payload);
};

export const removeOneById = async (id: string): Promise<void> => {
  const repository = getMediaRepository();
  await repository.removeOneById(id);
};
