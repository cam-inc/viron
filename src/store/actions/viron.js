import ObjectAssign from 'object-assign';
import exporter from './exporter';

// APIは必須でサポートしなければならない URI
const VIRON_URI = '/viron';

export default exporter('viron', {
  /**
   * viron情報(各管理画面の基本情報)を取得します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @return {Promise}
   */
  get: (context, endpointKey) => {
    const operationObject = context.getter('oas.operationObject', VIRON_URI, 'get');
    const api = context.getter('oas.api', operationObject.operationId);
    const currentEndpointKey = context.getter('current.all');
    const currentEndpoint = context.getter('endpoints.one', currentEndpointKey);
    const token = currentEndpoint.token;
    const networkingId = `networking_${Date.now()}`;

    return Promise
      .resolve()
      .then(() => context.commit('application.addNetworking', {
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
          context.commit('endpoints.updateToken', currentEndpointKey, token);
        }
        context.commit('viron.all', ObjectAssign({
          endpointKey
        }, res.obj));
        const endpoint = ObjectAssign({}, res.obj);
        // pagesは不要なので削除。
        delete endpoint.pages;
        context.commit('endpoints.update', currentEndpointKey, endpoint);
        context.commit('application.removeNetworking', networkingId, context);
      })
      .catch(err => {
        context.commit('application.removeNetworking', networkingId, context);
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
        context.commit('viron.all', null);
      });
  }
});
