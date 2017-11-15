import forEach from 'mout/array/forEach';
import forOwn from 'mout/object/forOwn';
import ObjectAssign from 'object-assign';
import exporter from './exporter';

export default exporter('oas', {
  /**
   * SwaggerClientを返します。
   * @param {Object} state
   * @return {SwaggerClient}
   */
  client: state => {
    return state.oas.client;
  },

  /**
   * resolve済みのOpenAPI Documentを返します。
   * @param {Object} state
   * @return {Object}
   */
  spec: state => {
    return state.oas.client.spec;
  },

  /**
   * resolve前のオリジナルのOpenAPI Documentを返します。
   * @param {Object} state
   * @return {Object}
   */
  originalSpec: state => {
    return state.oas.client.originalSpec;
  },

  /**
   * resolveされたAPI群を返します。
   * @param {Object} state
   * @return {Object}
   */
  apis: state => {
    return state.oas.client.apis;
  },

  /**
   * resolveされたAPI群をflatな構成にして返します。
   * @param {Object} state
   * @return {Object}
   */
  flatApis: state => {
    // client.apisはタグ分けされているので、まずflatな構成にする。
    const apis = {};
    forOwn(state.oas.client.apis, obj => {
      forOwn(obj, (api, operationId) => {
        apis[operationId] = api;
      });
    });
    return apis;
  },

  /**
   * 指定したoperationIdにマッチするresolveされたAPIを返します。
   * @param {Object} state
   * @param {String} operationId
   * @return {Function}
   */
  api: (state, operationId) => {
    const apis = {};
    forOwn(state.oas.client.apis, obj => {
      forOwn(obj, (api, operationId) => {
        apis[operationId] = api;
      });
    });
    return apis[operationId];
  },

  /**
   * 指定したpathとmethodにマッチするresolveされたAPIを返します。
   * @param {Object} state
   * @param {String} path
   * @param {String} method
   * @return {Function}
   */
  apiByPathAndMethod: (state, path, method) => {
    const operationObject = state.oas.client.spec.paths[path][method];
    const operationId = operationObject.operationId;
    const apis = {};
    forOwn(state.oas.client.apis, obj => {
      forOwn(obj, (api, operationId) => {
        apis[operationId] = api;
      });
    });
    return apis[operationId];
  },

  /**
   * 指定したpathにマッチするPathItemObjectを返します。
   * @param {Object} state
   * @param {String} path
   * @return {Object}
   */
  pathItemObject: (state, path) => {
    return state.oas.client.spec.paths[path];
  },

  /**
   * 指定したoperationIdにマッチするPathItemObjectのmethod名を返します。
   * @param {Object} state
   * @param {String} operationId
   * @return {String}
   */
  pathItemObjectMethodNameByOperationId: (state, operationId) => {
    let ret;
    forOwn(state.oas.client.spec.paths, pathItemObject => {
      if (!!ret) {
        return;
      }
      forOwn(pathItemObject, (operationObject, method) => {
        if (!!ret) {
          return;
        }
        if (operationObject.operationId === operationId) {
          ret = method;
        }
      });
    });
    return ret;
  },

  /**
   * 指定したpathとmethodにマッチするOperationObjectを返します。
   * @param {Object} state
   * @param {String} path
   * @param {String} method
   * @return {Object}
   */
  operationObject: (state, path, method) => {
    return state.oas.client.spec.paths[path][method];
  },

  /**
   * 指定したcomponentに関連するOperationObject(action)群を返します。
   * @param {Object} state
   * @param {Object} component
   * @return {Array}
   */
  operationObjectsAsAction: (state, component) => {
    const methods = ['get','put', 'post', 'delete'];
    const basePath = component.api.path;
    const primaryKey = component.primary;
    const actions = component.actions || [];

    // 関連API情報。後のOperationObject群抽出に使用します。
    const pathRefs = [];
    // 同じpath & method違いのoperationObjectは関連有りとみなす。
    forEach(methods, method => {
      // `get`はcomponent自身なのでスルーする。
      if (method === 'get') {
        return;
      }
      const isOperationObjectDefined = !!state.oas.client.spec.paths[basePath] && !!state.oas.client.spec.paths[basePath][method];
      if (!isOperationObjectDefined) {
        return;
      }
      pathRefs.push({
        path: basePath,
        method,
        appendTo: 'self'
      });
    });
    // primaryキーが存在する場合、`basePath/primaryKey`の各operationObjectは関連有りとみなす。
    // テーブルの各rowに紐づくOperationObjectとみなす。
    if (!!primaryKey) {
      const listBasePath = `${basePath}/{${primaryKey}}`;
      forEach(methods, method => {
        const isOperationObjectDefined = !!state.oas.client.spec.paths[listBasePath] && !!state.oas.client.spec.paths[listBasePath][method];
        if (!isOperationObjectDefined) {
          return;
        }
        pathRefs.push({
          path: listBasePath,
          method,
          appendTo: 'row'
        });
      });
    }
    // actionsに指定されたpath群のOperationObjectも関連有りとみなします。
    // path内にprimaryKeyと同一名の変数があれば、それはテーブルrowに紐づくOperationObjectとみなします。
    // primaryKeyと同一名の変数が無ければ、componentと紐づくOperationObjectとみなします。
    forEach(actions, actionBasePath => {
      const appendTo = (actionBasePath.indexOf(`{${primaryKey}}`) >= 0 ? 'row' : 'self');
      forEach(methods, method => {
        const isOperationObjectDefined = !!state.oas.client.spec.paths[actionBasePath] && !!state.oas.client.spec.paths[actionBasePath][method];
        if (!isOperationObjectDefined) {
          return;
        }
        pathRefs.push({
          path: actionBasePath,
          method,
          appendTo
        });
      });
    });

    // OperationObject群を抽出します。
    const operationObjects = [];
    forEach(pathRefs, ref => {
      const operationObject = state.oas.client.spec.paths[ref.path][ref.method];
      operationObjects.push(ObjectAssign({
        operationObject
      }, ref));
    });

    return operationObjects;
  },

  /**
   * 指定したpathとmethodにマッチするOperationObjectのoperationIdを返します。
   * @param {Object} state
   * @param {String} path
   * @param {String} method
   * @return {String}
   */
  operationId: (state, path, method) => {
    return state.oas.client.spec.paths[path][method].operationId;
  },

  /**
   * 指定したpathとmethodにマッチするOperationObjectのParameterObject群を返します。
   * @param {Object} state
   * @param {String} path
   * @param {String} method
   * @return {Array}
   */
  parameterObjects: (state, path, method) => {
    return state.oas.client.spec.paths[path][method].parameters || [];
  },

  /**
   * 指定したpathとmethodにマッチするOperationObject群を返します。
   * @param {Object} state
   * @param {String} path
   * @param {String} method
   * @return {Object}
   */
  responseObjects: (state, path, method) => {
    return state.oas.client.spec.paths[path][method].responses;
  },

  /**
   * 指定したpathとmethodにマッチするOperationObjectのresponseObjectを返します。
   * statusCodeを指定しない場合はデフォルトで200に設定されます。
   * @param {Object} state
   * @param {String} path
   * @param {String} method
   * @param {Number} statusCode
   * @return {Object}
   */
  responseObject: (state, path, method, statusCode = 200) => {
    return state.oas.client.spec.paths[path][method].responses[statusCode];
  },

  /**
   * 指定したpathとmethodにマッチするOperationObjectのresponseObjectのschemaObjectを返します。
   * statusCodeを指定しない場合はデフォルトで200に設定されます。
   * @param {Object} state
   * @param {String} path
   * @param {String} method
   * @param {Number} statusCode
   * @return {Object}
   */
  schemaObject: (state, path, method, statusCode = 200) => {
    return state.oas.client.spec.paths[path][method].responses[statusCode].schema;
  }
});
