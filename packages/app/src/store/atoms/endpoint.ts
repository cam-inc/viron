import { atom } from 'recoil';
import { KEY as STORAGE_KEY } from '$storage/index';
import { localStoragePersistence } from '$store/atomEffects';
import { Endpoint } from '$types/index';

export const NAME = 'endpoint';
const KEY = {
  LIST: 'list',
} as const;

export const list = atom<Endpoint[]>({
  key: `${NAME}.${KEY.LIST}`,
  default: [],
  effects_UNSTABLE: [
    localStoragePersistence<Endpoint[]>(STORAGE_KEY.ENDPOINT_LIST, []),
  ],
});
