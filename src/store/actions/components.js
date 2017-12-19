import contentDisposition from 'content-disposition';
import download from 'downloadjs';
import exporter from './exporter';

export default exporter('components', {
  /**
   * 一つのコンポーネント情報を取得します。
   * @param {riotx.Context} context
   * @param {String} componentId
   * @param {Object} componentDef
   * @param {Object} query
   * @return {Promise}
   */
  get: (context, componentId, componentDef, query = {}) => {
    const method = componentDef.api.method;
    // GETメソッドのみサポート。
    if (method !== 'get') {
      return Promise.reject('only `get` method is allowed.');
    }
    let path = componentDef.api.path;
    if (path.indexOf('/') !== 0) {
      path = '/' + path;
    }
    const api = context.getter('oas.apiByPathAndMethod', path, method);
    const currentEndpointKey = context.getter('current.all');
    const currentEndpoint = context.getter('endpoints.one', currentEndpointKey);
    const token = currentEndpoint.token;
    const networkingId = `networking_${Date.now()}`;
    return Promise
      .resolve()
      .then(() => context.commit('application.addNetworking', {
        id: networkingId
      }))
      .then(() => api(query, {
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
        context.commit('components.updateOne', componentId, componentDef, res.obj, res.headers);
        context.commit('application.removeNetworking', networkingId, context);
      })
      .catch(err => {
        context.commit('application.removeNetworking', networkingId, context);
        throw err;
      });
  },

  /**
   * APIコールします。
   * @param {riotx.Context} context
   * @param {Object} operationObject
   * @param {Object} params
   * @return {Promise}
   */
  operate: (context, operationObject, params) => {
    const api = context.getter('oas.api', operationObject.operationId);
    const token = context.getter('endpoints.one', context.getter('current.all')).token;
    const currentEndpointKey = context.getter('current.all');
    const networkingId = `networking_${Date.now()}`;

    return Promise
      .resolve()
      .then(() => context.commit('application.addNetworking', {
        id: networkingId
      }))
      .then(() => api(params, {
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
        context.commit('application.removeNetworking', networkingId, context);
        // tokenを更新する。
        const token = res.headers['Authorization'];
        if (!!token) {
          context.commit('endpoints.updateToken', currentEndpointKey, token);
        }
        // ダウンロード指定されていればダウンロードする。
        const contentDispositionHeader = res.headers['content-disposition'];
        if (!contentDispositionHeader) {
          return res;
        }
        const downloadFileInfo = contentDisposition.parse(contentDispositionHeader);
        if (downloadFileInfo.type !== 'attachment') {
          return res;
        }
        download(res.data, downloadFileInfo.parameters.filename, res.headers['content-type']);
        return res;
      })
      .catch(err => {
        context.commit('application.removeNetworking', networkingId, context);
        throw err;
      });
  },

  /**
   * 一件削除します。
   * @param {riotx.Context} context
   * @param {String} component_uid
   * @return {Promise}
   */
  remove: (context, component_uid) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('components.removeOne', component_uid);
      });
  },

  /**
   * 全件削除します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  removeAll: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('components.removeAll');
      });
  }
});
