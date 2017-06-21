import ObjectAssign from 'object-assign';
import swagger from '../../core/swagger';
import { constants as getters } from '../getters';
import { constants as mutations } from '../mutations';

// APIは必須でサポートしなければならない URI
const DMC_URI = '/dmc';

export default {
  /**
   * dmc情報を取得します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  get: context => {
    return new Promise((resolve, reject) => {
      const operationObject = swagger.client.spec.paths[DMC_URI].get;

      if (!operationObject || !swagger.client.apis.dmc || !swagger.client.apis.dmc[operationObject.operationId]) {
        return reject(new Error(`[fetch] ${swagger.client.url}; system entry point not found. (uri: ${DMC_URI})`));
      }

      const api = swagger.getApiByOperationID(operationObject.operationId);

      const token = context.getter(getters.ENDPOINTS_ONE, context.getter(getters.CURRENT)).token;

      api({/** TODO get only support. */}, {
        // TODO https://github.com/swagger-api/swagger-js/issues/1036 でやりたい
        // TODO component.jsと共通化したい
        requestInterceptor: (req) => {
          req.headers['Authorization'] = token;
          console.log('Interceptor(request):', req);
        },
        responseInterceptor: (res) => {
          console.log('Interceptor(response):', res);
        }
      }).then(res => {
        if (!res.ok) {
          throw new Error(`[fetch] ${res.url} error.`);
        }

        console.log(`[fetch] ${res.url} success.`);

        return {
          response: res.obj,
          operationObject
        };
      }).then(res => {
        context.commit(mutations.DMC, res);
        const key = context.getter(mutations.CURRENT);
        const endpoint = context.getter(getters.ENDPOINTS_ONE, key);
        context.commit(mutations.ENDPOINTS_UPDATE, key, ObjectAssign({}, endpoint, res.response));
      }).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  },

  /**
   * dmc情報を削除します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  remove: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.DMC, null);
      });
  }
};
