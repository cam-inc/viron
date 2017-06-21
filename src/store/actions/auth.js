import { fetch } from '../../core/fetch';
import { constants as getters } from '../getters';
import { constants as mutations } from '../mutations';

export default {
  /**
   * 指定されたエンドポイントのtokenを更新します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {String} token
   * @return {Promise}
   */
  update: (context, endpointKey, token) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.ENDPOINTS_UPDATE_TOKEN, endpointKey, token);
      });
  },

  /**
   * 指定されたエンドポイントのtokenを削除します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @return {Promise}
   */
  remove: (context, endpointKey) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.ENDPOINTS_UPDATE_TOKEN, endpointKey, null);
      });
  },

  /**
   * 指定されたエンドポイントのtokenが有効か確認します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @return {Promise}
   */
  validate: (context, endpointKey) => {
    const endpoint = context.getter(getters.ENDPOINTS_ONE, endpointKey);
    return Promise
      .resolve()
      .then(() => fetch(context, endpoint.url, {
        headers: {
          'Authorization': endpoint.token
        }
      }))
      .then(() => {
        return true;
      })
      .catch(err => {
        if (err.status !== 401) {
          throw err;
        }
        context.commit(mutations.ENDPOINTS_UPDATE_TOKEN, endpointKey, null);
        return false;
      });
  },

  /**
   * 指定されたエンドポイントの認証手段を調べます。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @return {Promise}
   */
  getTypes: (context, endpointKey) => {
    const endpoint = context.getter(getters.ENDPOINTS_ONE, endpointKey);
    const anchorElm = document.createElement('a');
    anchorElm.href = endpoint.url;
    const fetchUrl = `${anchorElm.origin}/dmc_authtype`;

    return Promise
      .resolve()
      .then(() => fetch(context, fetchUrl))
      .then(response => response.json());
  },

  /**
   * OAuth認証を行います。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {Object} authtype
   * @return {Promise}
   */
  signinOAuth: (context, endpointKey, authtype) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.OAUTH_ENDPOINT_KEY, endpointKey);
      })
      .then(() => {
        const endpoint = context.getter(getters.ENDPOINTS_ONE, endpointKey);
        const anchorElm = document.createElement('a');
        anchorElm.href = endpoint.url;
        const fetchUrl = `${anchorElm.origin}${authtype.url}?redirect_url=${encodeURIComponent(location.href)}`;
        location.href = fetchUrl;
      });
  },

  /**
   * メールxパスワード認証を行います。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {Object} authtype
   * @param {String} email
   * @param {String} password
   * @return {Promise}
   */
  signinEmail: (context, endpointKey, authtype, email, password) => {
    const endpoint = context.getter(getters.ENDPOINTS_ONE, endpointKey);
    const anchorElm = document.createElement('a');
    anchorElm.href = endpoint.url;
    const fetchUrl = `${anchorElm.origin}${authtype.url}`;

    return Promise
      .resolve()
      .then(() => fetch(context, fetchUrl, {
        method: authtype.method,
        body: {
          email,
          password
        }
      }))
      .then(response => {
        const token = response.headers.get('Authorization');
        context.commit(mutations.ENDPOINTS_UPDATE_TOKEN, endpointKey, token);
      });
  }
};
