import {
  ListWithPager,
  TABLE_SORT_DELIMITER,
  TABLE_SORT_ORDER,
} from '@viron/lib';
import { FindConditions, getItemRepository } from '../repositories';

export interface Item {
  id: string;
  name: string;
  description: string;
  sellingPrice: number;
  imageUrl: string;
  detail: ItemDetail;
  createdAt: number;
  updatedAt: number;
}

export type ItemWithoutDetail = Omit<Item, 'detail'>;

export interface RealGoods {
  type: 'realGoods';
  productCode: string;
  manufacturer: string;
  manufacturingCost: number;
}

export interface DigitalContents {
  type: 'digitalContents';
  downloadUrl: string;
}

export type ItemDetail = RealGoods | DigitalContents;

export interface ItemView extends Item {
  itemId: string; // alias to id
}

export interface ItemCreateAttributes {
  name: string;
  description: string;
  sellingPrice: number;
  imageUrl: string;
  detail: ItemDetail;
}

export interface ItemUpdateAttributes {
  name: string;
  description: string;
  sellingPrice: number;
  imageUrl: string;
  detail: ItemDetail;
}

const format = (item: Item): ItemView => {
  return Object.assign({}, item, { itemId: item.id });
};

export const list = async (
  conditions?: FindConditions<Item>,
  size?: number,
  page?: number,
  sort = [`createdAt${TABLE_SORT_DELIMITER}${TABLE_SORT_ORDER.DESC}`]
): Promise<ListWithPager<ItemView>> => {
  const repository = getItemRepository();
  const result = await repository.findWithPager(conditions, size, page, sort);
  return {
    ...result,
    list: result.list.map(format),
  };
};

export const findOne = async (
  conditions: FindConditions<Item>
): Promise<ItemView> => {
  const repository = getItemRepository();
  const item = await repository.findOne(conditions);
  return format(item);
};

export const createOne = async (
  payload: ItemCreateAttributes
): Promise<ItemView> => {
  const repository = getItemRepository();
  const item = await repository.createOne(payload);
  return format(item);
};

export const updateOneById = async (
  id: string,
  payload: ItemUpdateAttributes
): Promise<void> => {
  const repository = getItemRepository();
  await repository.updateOneById(id, payload);
};

export const removeOneById = async (id: string): Promise<void> => {
  const repository = getItemRepository();
  await repository.removeOneById(id);
};
