import 'url-polyfill';
import constants from '../../core/constants';

export default {
  get: (context, key) => {
    const endpoint = context.getter(constants.GETTER_ENDPOINT_ONE, key);
    const url = new URL(endpoint.url)
    let fetchUrl = `${url.origin}/dmc_auth`;
    return fetch(fetchUrl)
      .then((response) => {
        return response.json();
      })
      .then(json => {
        return json; // TODO state管理するかは後で決める
      })
    ;
  },

}
