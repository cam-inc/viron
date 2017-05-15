import constants from '../../core/constants';

export default {
  update: (context, key, token) => {
    context.commit(constants.MUTATION_ENDPOINTS_TOKEN_UPDATE, key, token);
  },

  remove: (context, key) => {
    context.commit(constants.MUTATION_ENDPOINTS_TOKEN_UPDATE, key, null);
  },

  // check if the local stored endpoint token is valid.
  validate: (context, key) => {
    const endpoint = context.getter(constants.GETTER_ENDPOINTS_ONE, key);

    return fetch(endpoint.url, {
      headers: {
        'Authorization': endpoint.token
      }
    })
      .then(response => {
        if (response.status !== 401) {
          return true;
        }
        context.commit(constants.MUTATION_ENDPOINTS_TOKEN_UPDATE, key, null);
        return false;
      });
  },

  // show signin modal.
  signInShow: (context, key) => {
    return  Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_AUTH_SIGN_IN_SHOW, key);
      })
    ;
  },

  //
  signInOAuth: (context, key, authtype) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_OAUTHENDPOINTKEY, key);
      })
      .then(() => {
        const endpoint = context.getter(constants.GETTER_ENDPOINTS_ONE, key);
        const url = new URL(endpoint.url);
        let fetchUrl = `${url.origin}${authtype.url}?redirect_url=${encodeURIComponent(location.href)}`;
        location.href = fetchUrl;
      });
  },

  // sign in with email and password.
  signInEMail: (context, key, authtype, email, password) => {
    const endpoint = context.getter(constants.GETTER_ENDPOINTS_ONE, key);
    const url = new URL(endpoint.url);
    const fetchUrl = `${url.origin}${authtype.url}`;

    return fetch(fetchUrl, {
      method: authtype.method,
      mode: 'cors',
      body: JSON.stringify({ email, password })
    }).then(response => {
      if (!response.ok) {
        throw new Error('login failed.');
      }
      return response.headers.get('Authorization');
    }).then(token => {
      context.commit(constants.MUTATION_ENDPOINTS_TOKEN_UPDATE, key, token);
    });
  }

};
