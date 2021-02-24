import { selectorFamily } from 'recoil';
import { listState } from '$store/atoms/endpoint';
import { Endpoint, EndpointID } from '$types/index';

const name = 'endpointSelector';

export const oneState = selectorFamily<Endpoint | null, { id: EndpointID }>({
  key: `${name}.list`,
  get: function (params: { id: EndpointID }) {
    return function ({ get }): Endpoint | null {
      const endpointList = get(listState);
      return (
        endpointList.find(function (endpoint) {
          return endpoint.id === params.id;
        }) || null
      );
    };
  },
  set: function (params: { id: EndpointID }) {
    return function ({ set }, newValue) {
      return set(listState, function (currVal) {
        return [...currVal].map(function (endpoint) {
          if (endpoint.id !== params.id) {
            return endpoint;
          }
          return { ...endpoint, ...newValue };
        });
      });
    };
  },
});
