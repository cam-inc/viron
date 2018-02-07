import isObject from 'mout/lang/isObject';
import encode from 'mout/queryString/encode';
import { fetch } from '../../core/fetch';
import exporter from './exporter';

// swagger-client(swagger-js)は外部ファイル読み込みのため、SwaggerClientオブジェクトはglobal(i.e. window)に格納されている。
const SwaggerClient = window.SwaggerClient;

export default exporter('oas', {
  /**
   * OAS準拠ファイルを取得/resolveし、SwaggerClientインスタンスを生成します。
   * @see: https://github.com/swagger-api/swagger-js#swagger-specification-resolver
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {String} url
   * @param {String} token
   * @return {Promise}
   */
  setup: (context, endpointKey, url, token) => {
    return Promise
      .resolve()
      .then(() => SwaggerClient.http({
        url,
        headers: {
          'Authorization': token
        }
      }))
      .then(res => {
        // 401エラーは想定内。
        if (res.status === 401) {
          const err = new Error();
          err.name = '401 Authorization Required';
          err.status = res.spec.status;
          return Promise.reject(err);
        }
        const body = res.body;
        // レスポンスがOAS2.0か否か確認。
        // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#swagger-object
        if (!isObject(body) || body.swagger !== '2.0') {
          return Promise.reject({
            name: url,
            message: 'レスポンスがOAS2.0に準拠していません。'
          });
        }
        return body;
      })
      .then(res => SwaggerClient({
        spec: res
      }))
      .then(client => {
        const errors = client.errors;
        if (!!errors && !!errors.length) {
          return Promise.reject(errors);
        }
        return client;
      })
      .then(client => {
        context.commit('oas.client', client);
        context.commit('endpoints.update', endpointKey, client.spec.info);
      });
  },

  /**
   * OAS情報をクリアします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  clear: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('oas.clearClient');
      });
  },

  /**
   * Autocompleteリストを取得します。
   * @param {riotx.Context} context
   * @param {String} path
   * @param {Object} query
   * @return {Promise}
   */
  getAutocomplete: (context, path, query) => {
    const currentEndpointKey = context.getter('current.all');
    const currentEndpoint = context.getter('endpoints.one', currentEndpointKey);
    const token = currentEndpoint.token;
    const url = `${new URL(currentEndpoint.url).origin}${path}${encode(query)}`;
    return Promise
      .resolve()
      .then(() => fetch(context, url, {
        headers: {
          'Authorization': token
        }
      }))
      .then(res => res.json());
  }
});
