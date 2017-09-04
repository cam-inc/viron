import forEach from 'mout/array/forEach';
import forOwn from 'mout/object/forOwn';
import ObjectAssign from 'object-assign';

export default {
  /**
   * SwaggerClientを返します。
   * @param {riotx.Context} context
   * @return {SwaggerClient}
   */
  client: context => {
    return context.state.oas.client;
  },

  /**
   * resolve済みのOpenAPI Documentを返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  spec: context => {
    return context.state.oas.client.spec;
  },

  /**
   * resolve前のオリジナルのOpenAPI Documentを返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  originalSpec: context => {
    return context.state.oas.client.originalSpec;
  },

  /**
   * resolveされたAPI群を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  apis: context => {
    return context.state.oas.client.apis;
  },

  /**
   * resolveされたAPI群をflatな構成にして返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  flatApis: context => {
    // client.apisはタグ分けされているので、まずflatな構成にする。
    const apis = {};
    forOwn(context.state.oas.client.apis, obj => {
      forOwn(obj, (api, operationId) => {
        apis[operationId] = api;
      });
    });
    return apis;
  },

  /**
   * 指定したoperationIdにマッチするresolveされたAPIを返します。
   * @param {riotx.Context} context
   * @param {String} operationId
   * @return {Function}
   */
  api: (context, operationId) => {
    const apis = {};
    forOwn(context.state.oas.client.apis, obj => {
      forOwn(obj, (api, operationId) => {
        apis[operationId] = api;
      });
    });
    return apis[operationId];
  },

  /**
   * 指定したpathとmethodにマッチするresolveされたAPIを返します。
   * @param {riotx.Context} context
   * @param {String} path
   * @param {String} method
   * @return {Function}
   */
  apiByPathAndMethod: (context, path, method) => {
    const operationObject = context.state.oas.client.spec.paths[path][method];
    const operationId = operationObject.operationId;
    const apis = {};
    forOwn(context.state.oas.client.apis, obj => {
      forOwn(obj, (api, operationId) => {
        apis[operationId] = api;
      });
    });
    return apis[operationId];
  },

  /**
   * 指定したpathにマッチするPathItemObjectを返します。
   * @param {riotx.Context} context
   * @param {String} path
   * @return {Object}
   */
  pathItemObject: (context, path) => {
    return context.state.oas.client.spec.paths[path];
  },

  /**
   * 指定したpathとmethodにマッチするOperationObjectを返します。
   * @param {riotx.Context} context
   * @param {String} path
   * @param {String} method
   * @return {Object}
   */
  operationObject: (context, path, method) => {
    return context.state.oas.client.spec.paths[path][method];
  },

  /**
   * 指定したcomponentに関連するOperationObject(action)群を返します。
   * @param {riotx.Context} context
   * @param {Object} component
   * @return {Array}
   */
  operationObjectsAsAction: (context, component) => {
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
      const isOperationObjectDefined = !!context.state.oas.client.spec.paths[basePath][method];
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
        const isOperationObjectDefined = !!context.state.oas.client.spec.paths[listBasePath][method];
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
        const isOperationObjectDefined = !!context.state.oas.client.spec.paths[actionBasePath][method];
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
      const operationObject = context.state.oas.client.spec.paths[ref.path][ref.method];
      operationObjects.push(ObjectAssign({
        operationObject
      }, ref));
    });

    return operationObjects;
  },

  /**
   * 指定したpathとmethodにマッチするOperationObjectのoperationIdを返します。
   * @param {riotx.Context} context
   * @param {String} path
   * @param {String} method
   * @return {String}
   */
  operationId: (context, path, method) => {
    return context.state.oas.client.spec.paths[path][method].operationId;
  },

  /**
   * 指定したpathとmethodにマッチするOperationObjectのParameterObject群を返します。
   * @param {riotx.Context} context
   * @param {String} path
   * @param {String} method
   * @return {Array}
   */
  parameterObjects: (context, path, method) => {
    return context.state.oas.client.spec.paths[path][method].parameters || [];
  },

  /**
   * 指定したpathとmethodにマッチするOperationObject群を返します。
   * @param {riotx.Context} context
   * @param {String} path
   * @param {String} method
   * @return {Object}
   */
  responseObjects: (context, path, method) => {
    return context.state.oas.client.spec.paths[path][method].responses;
  },

  /**
   * 指定したpathとmethodにマッチするOperationObjectのresponseObjectを返します。
   * statusCodeを指定しない場合はデフォルトで200に設定されます。
   * @param {riotx.Context} context
   * @param {String} path
   * @param {String} method
   * @param {Number} statusCode
   * @return {Object}
   */
  responseObject: (context, path, method, statusCode = 200) => {
    return context.state.oas.client.spec.paths[path][method].responses[statusCode];
  },

  /**
   * 指定したpathとmethodにマッチするOperationObjectのresponseObjectのschemaObjectを返します。
   * statusCodeを指定しない場合はデフォルトで200に設定されます。
   * @param {riotx.Context} context
   * @param {String} path
   * @param {String} method
   * @param {Number} statusCode
   * @return {Object}
   */
  schemaObject: (context, path, method, statusCode = 200) => {
    return context.state.oas.client.spec.paths[path][method].responses[statusCode].schema;
  }
};
