import { atom } from 'recoil';
import { localStoragePersistenceEffect } from '$store/atomEffects';
import { Endpoint } from '$types/index';

const name = 'endpoint';

export const listState = atom<Endpoint[]>({
  key: `${name}.list`,
  default: [],
  // eslint-disable-next-line @typescript-eslint/camelcase
  effects_UNSTABLE: [localStoragePersistenceEffect<Endpoint[]>('endpointList')],
});
