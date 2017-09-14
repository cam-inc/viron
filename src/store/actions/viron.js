import ObjectAssign from 'object-assign';
import { constants as getters } from '../getters';
import { constants as mutations } from '../mutations';

// APIは必須でサポートしなければならない URI
const VIRON_URI = '/viron';

export default {
  /**
   * viron情報(各管理画面の基本情報)を取得します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  get: context => {
    const operationObject = context.getter(getters.OAS_OPERATION_OBJECT, VIRON_URI, 'get');
    const api = context.getter(getters.OAS_API, operationObject.operationId);
    const currentEndpointKey = context.getter(getters.CURRENT);
    const currentEndpoint = context.getter(getters.ENDPOINTS_ONE, currentEndpointKey);
    const token = currentEndpoint.token;
    const networkingId = `networking_${Date.now()}`;

    return Promise
      .resolve()
      .then(() => context.commit(mutations.APPLICATION_NETWORKINGS_ADD, {
        id: networkingId
      }))
      .then(() => api({}, {
        requestInterceptor: req => {
          req.headers['Authorization'] = token;
        }
      }))
      .then(res => {
        if (!res.ok) {
          return Promise.reject(res);
        }
        return res;
      })
      .then(res => {
        // tokenを更新する。
        const token = res.headers['Authorization'];
        if (!!token) {
          context.commit(mutations.ENDPOINTS_UPDATE_TOKEN, currentEndpointKey, token);
        }
        context.commit(mutations.VIRON, res.obj);
        const endpoint = ObjectAssign({}, res.obj);
        // pagesは不要なので削除。
        delete endpoint.pages;
        context.commit(mutations.ENDPOINTS_UPDATE, currentEndpointKey, endpoint);
        context.commit(mutations.APPLICATION_NETWORKINGS_REMOVE, networkingId);
      })
      .catch(err => {
        context.commit(mutations.APPLICATION_NETWORKINGS_REMOVE, networkingId);
        throw err;
      });
  },

  /**
   * viron情報を削除します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  remove: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.VIRON, null);
      });
  }
};
