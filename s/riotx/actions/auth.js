import constants from '../../core/constants';

export default {
  update: (context, key) => {
    const endpoint = context.getter(constants.GETTER_ENDPOINT_ONE, key);
    return fetch(endpoint.url, {
      headers: {"Authorization": `Bearer: ${endpoint.token}`}
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

  //
  signInGoogle: (context, key, authtype) => {
    const endpoint = context.getter(constants.GETTER_ENDPOINT_ONE, key);
    const url = new URL(endpoint.url);
    let fetchUrl = `${url.origin}${authtype.url}`;
    return fetch(fetchUrl, {
      method: 'POST',
      // redirect: 'manual',
      mode: 'cors',
    })
      .then((response) => {
        if (response.type === 'opaqueredirect') {
          return response.blob();
        }

        throw new Error('TODO error....................');
      })
      .then(json => {
        debugger;
        return json; // TODO state管理するかは後で決める
      })
      ;
  },

  signInEMail: (context, key, authtype, email, password) => {
    const endpoint = context.getter(constants.GETTER_ENDPOINT_ONE, key);
    const url = new URL(endpoint.url);
    let fetchUrl = `${url.origin}${authtype.url}`;

    return fetch(fetchUrl, {
      method: 'POST',
      mode: 'cors',
    })
      .then((response) => {
        // TODO サーバー動いたら実装する
        throw new Error('aaa');
        return 'ABCDEFGHIJKLMN';
      })
      .then(token => {
        context.commit(constants.MUTATION_ENDPOINT_TOKEN_UPDATE, key, token);
      })
    ;
  }

}
