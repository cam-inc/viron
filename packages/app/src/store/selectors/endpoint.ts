import { selectorFamily } from 'recoil';
import { list as endpointListAtom, NAME } from '$store/atoms/endpoint';
import { Endpoint, EndpointID } from '$types/index';

const KEY = {
  ONE: 'one',
} as const;

export const oneState = selectorFamily<Endpoint | null, { id: EndpointID }>({
  key: `${NAME}.${KEY.ONE}`,
  get:
    ({ id }) =>
    ({ get }) => {
      const endpointList = get(endpointListAtom);
      return endpointList.find((endpoint) => endpoint.id === id) || null;
    },
  set:
    ({ id }) =>
    ({ set }, newValue) => {
      set(endpointListAtom, (currVal) => {
        return currVal.map((endpoint) => {
          if (endpoint.id !== id) {
            return endpoint;
          }
          return { ...endpoint, ...newValue };
        });
      });
    },
});
