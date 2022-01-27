import { atom } from 'recoil';
import { KEY as STORAGE_KEY } from '~/storage';
import { localStoragePersistence } from '~/store/atomEffects';
import { Endpoint, EndpointGroup } from '~/types';

export const NAME = 'endpoint';
const KEY = {
  LIST: 'list',
  GROUP_LIST: 'groupList',
} as const;

export const list = atom<Endpoint[]>({
  key: `${NAME}.${KEY.LIST}`,
  default: [],
  effects_UNSTABLE: [
    localStoragePersistence<Endpoint[]>(STORAGE_KEY.ENDPOINT_LIST, []),
  ],
});

export const groupList = atom<EndpointGroup[]>({
  key: `${NAME}.${KEY.GROUP_LIST}`,
  default: [],
  effects_UNSTABLE: [
    localStoragePersistence<EndpointGroup[]>(
      STORAGE_KEY.ENDPOINT_GROUP_LIST,
      []
    ),
  ],
});
