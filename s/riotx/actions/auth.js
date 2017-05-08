import constants from '../../core/constants';

export default {
  // check if the local stored endpoint token is valid.
  update: (context, key) => {
    const endpoint = context.getter(constants.GETTER_ENDPOINT_ONE, key);
    return fetch(endpoint.url, {
      headers: {
        "Authorization": endpoint.token
      }
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

  // show signin modal.
  signInShow: context => {
    return  Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_AUTH_SIGN_IN_SHOW);
      })
    ;
  },

  //
  signInGoogle: (context, key, authtype) => {
    const endpoint = context.getter(constants.GETTER_ENDPOINT_ONE, key);
    const url = new URL(endpoint.url);
    let fetchUrl = `${url.origin}${authtype.url}?redirect_url=${encodeURIComponent(location.href)}`;
    location.href = fetchUrl;
  },

  signInEMail: (context, key, authtype, email, password) => {
    const endpoint = context.getter(constants.GETTER_ENDPOINT_ONE, key);
    const url = new URL(endpoint.url);
    let fetchUrl = `${url.origin}${authtype.url}`;

    return fetch(fetchUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ email, password })
    })
      .then((response) => {
        return response.headers.get("Authorization");
      })
      .then(token => {
        context.commit(constants.MUTATION_ENDPOINT_TOKEN_UPDATE, key, token);
      })
    ;
  }

}
