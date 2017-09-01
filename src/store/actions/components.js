import contentDisposition from 'content-disposition';
import download from 'downloadjs';
import forEach from 'mout/array/forEach';
import ObjectAssign from 'object-assign';
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
    const method = component.api.method;
    // GETメソッドのみサポート。
    if (method !== 'get') {
      return Promise.reject('only `get` method is allowed.');
    }
    let path = component.api.path;
    if (path.indexOf('/') !== 0) {
      path = '/' + path;
    }
    const operationObject = context.getter(getters.OAS_OPERATION_OBJECT, path, method);
    // 関連のあるpath情報を取得します。
    let pathRefs = [];
    // 同じpath 且つ method名違いのoperationObjectは関連有りとみなす。
    forEach(['put', 'post', 'delete', 'options', 'head', 'patch'], method => {
      if (!context.getter(getters.OAS_OPERATION_OBJECT, path, method)) {
        return;
      }
      pathRefs.push({
        path,
        method,
        appendTo: 'self'
      });
    });
    // `x-ref`を独自仕様として仕様する。このkeyが付いたものを関連APIとする。
    pathRefs = pathRefs.concat(operationObject['x-ref'] || []);
    // 関連API(path)群を付与する。
    const actions = [];
    forEach(pathRefs, ref => {
      const operationObject = context.getter(getters.OAS_OPERATION_OBJECT, ref.path, ref.method);
      actions.push(ObjectAssign({
        operationObject
      }, ref));
    });

    const api = context.getter(getters.OAS_API_BY_PATH_AND_METHOD, path, method);
    const currentEndpointKey = context.getter(getters.CURRENT);
    const currentEndpoint = context.getter(getters.ENDPOINTS_ONE, currentEndpointKey);
    const token = currentEndpoint.token;
    return api(query, {
      requestInterceptor: req => {
        req.headers['Authorization'] = token;
      }
    }).then(res => {
      if (!res.ok) {
        return Promise.reject(`fetch failed: ${res.url}`);
      }
      return res;
    }).then(res => {
      // tokenを更新する。
      const token = res.headers['Authorization'];
      if (!!token) {
        context.commit(mutations.ENDPOINTS_UPDATE_TOKEN, currentEndpointKey, token);
      }
       // `component.pagination`からページングをサポートしているか判断する。
      // サポートしていれば手動でページング情報を付加する。
      let hasPagination = false;
      let pagination;
      if (component.pagination) {
        hasPagination = true;
        pagination = {
          // `x-pagination-current-page`等は独自仕様。
          // DMCを使用するサービスはこの仕様に沿う必要がある。
          currentPage: Number(res.headers['x-pagination-current-page'] || 0),
          size: Number(res.headers['x-pagination-limit'] || 0),
          maxPage: Number(res.headers['x-pagination-total-pages'] || 0)
        };
      }
      context.commit(mutations.COMPONENTS_UPDATE_ONE, {
        component_uid,
        response: res.obj,// APIレスポンス内容そのまま。
        schemaObject: context.getter(getters.OAS_SCHEMA_OBJECT, path, method),// OASのschema。
        parameterObjects: context.getter(getters.OAS_PARAMETER_OBJECTS, path, method),// OASのparameterObject群。
        actions,// 関連API群。
        hasPagination,
        pagination,// ページング関連。
        table_labels: component.table_labels || []// テーブル行名で優先度が高いkey群。
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
    const api = context.getter(getters.OAS_API, operationObject.operationId);
    const token = context.getter(getters.ENDPOINTS_ONE, context.getter(getters.CURRENT)).token;
    const currentEndpointKey = context.getter(getters.CURRENT);

    return api(params, {
      requestInterceptor: req => {
        req.headers['Authorization'] = token;
      }
    }).then(res => {
      // tokenを更新する。
      const token = res.headers['Authorization'];
      if (!!token) {
        context.commit(mutations.ENDPOINTS_UPDATE_TOKEN, currentEndpointKey, token);
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
