import { constants as mutations } from '../mutations';

// swagger-client(swagger-js)は外部ファイル読み込みのため、SwaggerClientオブジェクトはglobal(i.e. window)に格納されている。
const SwaggerClient = window.SwaggerClient;

export default {
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
        return res;
      })
      .then(res => SwaggerClient({
        spec: res.body
      }))
      .then(client => {
        const errors = client.errors;
        if (!!errors && !!errors.length) {
          return Promise.reject(errors);
        }
        return client;
      })
      .then(client => {
        context.commit(mutations.OAS_CLIENT, client);
        context.commit(mutations.ENDPOINTS_UPDATE, endpointKey, client.spec.info);
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
        context.commit(mutations.OAS_CLIENT_CLEAR);
      });
  }
};
