import contentDisposition from 'content-disposition';
import download from 'downloadjs';
import forEach from 'mout/array/forEach';
import swagger from '../../core/swagger';
import { constants as getters } from '../getters';
import { constants as mutations } from '../mutations';

export default {
  /**
   * 一つのコンポーネント情報を取得します。
   * @param {riotx.Context} context
   * @param {String} component_uid
   * @param {Object} component
   * @param {Object} query
   * @return {Promise}
   */
  get: (context, component_uid, component, query) => {
    return new Promise((resolve, reject) => {
      const method = component.api.method;
      // GETメソッドのみサポート。
      if (method !== 'get') {
        return reject('only `get` method is allowed.');
      }

      let path = component.api.path;
      if (path.indexOf('/') !== 0) {
        path = '/' + path;
      }

      // @see: http://swagger.io/specification/#itemsObject
      const pathItemObject = swagger.client.spec.paths[path];
      if (!pathItemObject || !pathItemObject[method]) {
        return reject(`[fetch] API definition is not found. ${method} ${path}`);
      }
      // 関連のあるpath情報を取得します。
      let pathRefs = [];
      forEach(['put', 'post', 'delete', 'options', 'head', 'patch'], method => {
        if (!pathItemObject || !pathItemObject[method]) {
          return;
        }
        pathRefs.push({
          path,
          method,
          appendTo: 'self'
        });
      });
      // `x-ref`を独自仕様として仕様する。このkeyが付いたものを関連APIとする。
      pathRefs = pathRefs.concat(pathItemObject['get']['x-ref'] || []);
      // @see: http://swagger.io/specification/#operationObject
      const operationObject = pathItemObject[method];
      const api = swagger.getApiByOperationID(operationObject.operationId);

      api(query, {
        // TODO https://github.com/swagger-api/swagger-js/issues/1036 でやりたい
        requestInterceptor: req => {
          // TODO: `headers`とかでtokenのセットが可能か？？
          req.headers['Authorization'] = context.getter(getters.ENDPOINTS_ONE, context.getter(getters.CURRENT)).token;
        }
      }).then(res => {
        if (!res.ok) {
          return reject(`[fetch] ${res.url} error.`);
        }
        context.commit(mutations.COMPONENTS_UPDATE_ONE, {
          response: res,
          operationObject,
          pathRefs,
          component,
          component_uid: component_uid
        });
        return resolve();
      }).catch(err => {
        reject(err);
      });
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
    const api = swagger.getApiByOperationID(operationObject.operationId);
    const token = context.getter(getters.ENDPOINTS_ONE, context.getter(getters.CURRENT)).token;

    return api(params, {
      requestInterceptor: req => {
        req.headers['Authorization'] = token;
      }
    }).then(res => {
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
        context.commit(mutations.COMPONENTS_REMOVE_ONE, component_uid);
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
        context.commit(mutations.COMPONENTS_REMOVE_ALL);
      });
  }
};
