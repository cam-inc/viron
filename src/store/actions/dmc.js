import ObjectAssign from 'object-assign';
import { constants as getters } from '../getters';
import { constants as mutations } from '../mutations';

// APIは必須でサポートしなければならない URI
const DMC_URI = '/dmc';

export default {
  /**
   * dmc情報(各管理画面の基本情報)を取得します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  get: context => {
    const operationObject = context.getter(getters.OAS_OPERATION_OBJECT, DMC_URI, 'get');
    const api = context.getter(getters.OAS_API, operationObject.operationId);
    const currentEndpointKey = context.getter(getters.CURRENT);
    const currentEndpoint = context.getter(getters.ENDPOINTS_ONE, currentEndpointKey);
    const token = currentEndpoint.token;

    return Promise
      .resolve()
      .then(() => api({}, {
        requestInterceptor: (req) => {
          req.headers['Authorization'] = token;
        }
      }))
      .then(res => {
        if (!res.ok) {
          return Promise.reject(`fetch failed: ${res.url}`);
        }
        return res;
      })
      .then(res => {
        // tokenを更新する。
        const token = res.headers['Authorization'];
        if (!!token) {
          context.commit(mutations.ENDPOINTS_UPDATE_TOKEN, currentEndpointKey, token);
        }
        context.commit(mutations.DMC, res.obj);
        const endpoint = ObjectAssign({}, res.obj);
        // pagesは不要なので削除。
        delete endpoint.pages;
        context.commit(mutations.ENDPOINTS_UPDATE, currentEndpointKey, endpoint);
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
