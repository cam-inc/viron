import { selector } from 'recoil';
import { Endpoint } from '$types/index';

const fetchEndpoints = async function (): Promise<Endpoint[]> {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve([
        {
          url: 'http://localhost:8000',
          id: '',
        },
      ]);
    }, 1000 * 5);
  });
};

const name = 'endpoint';

export const listQueryState = selector({
  key: `${name}.listQuery`,
  get: async function () {
    const resp = await fetchEndpoints();
    return resp;
  },
});
