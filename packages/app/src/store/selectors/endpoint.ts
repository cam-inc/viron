import { selectorFamily } from 'recoil';
import { listState } from '$store/atoms/endpoint';
import { Endpoint, EndpointID } from '$types/index';

const name = 'endpoint';

export const oneState = selectorFamily({
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
});
