import 'url-polyfill';
import constants from '../../core/constants';

export default {
  get: (context, key) => {
    const endpoint = context.getter(constants.GETTER_ENDPOINT_ONE, key);
    const url = new URL(endpoint.url);
    const fetchUrl = `${url.origin}/dmc_authtype`;
    return fetch(fetchUrl)
      .then(response => {
        return response.json();
      })
      .then(authtypes => {
        return authtypes; // TODO state管理するかは後で決める
      });
  }
};
