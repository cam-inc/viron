import 'url-polyfill';
import constants from '../../core/constants';

export default {
  get: (context, key) => {
    const endpoint = context.getter(constants.GETTER_ENDPOINTS_ONE, key);
    const url = new URL(endpoint.url);
    const fetchUrl = `${url.origin}/dmc_authtype`;
    return fetch(fetchUrl)
      .then(response => {
        const authtypes = response.json();
        return authtypes;
      });
  }
};
