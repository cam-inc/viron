import constants from '../../core/constants';

export default {
  update: (context, key) => {
    const endpoint = context.getter(constants.GETTER_ENDPOINT_ONE, key);
    return fetch(endpoint.url, {
      headers: { "Authorization": `Bearer: ${endpoint.token}` }
    })
      .then((response) => {
        if (response.status === 401) {
          context.commit(constants.MUTATION_ENDPOINT_TOKEN_UPDATE, key, null);
          return;
        }
        context.commit(constants.MUTATION_ENDPOINT_TOKEN_UPDATE, key, endpoint.token);
      })
    ;
  },

}
