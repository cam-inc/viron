import { forEach } from 'mout/array';
import constants from '../../core/constants';
import swagger from '../../swagger';

export default {
  get: (context, component_uid, component, query = {}) => {
    return new Promise((resolve, reject) => {
      const method = component.api.method.get();
      // only `get` method is allowed.
      if (method !== 'get') {
        return reject('only `get` method is allowed.');
      }

      let path = component.api.path.get();
      if (path.indexOf('/') !== 0) {
        path = '/' + path;
      }

      // for more detail, @see: http://swagger.io/specification/#itemsObject
      const pathItemObject = swagger.client.spec.paths[path];
      if (!pathItemObject || !pathItemObject[method]) {
        return reject(`[fetch] API define not found. ${method} ${path}`);
      }
      // `pathRefs` is a collection of paths that is related to the component.
      const pathRefs = [{
        // `isSelf` is a flag that is used to determine whether the path is related to this component or others.
        isSelf: true,
        path
      }];
      // `x-ref` is a custom key that is used to link paths.
      forEach(pathItemObject['get']['x-ref'] || [], path => {
        pathRefs.push({
          isSelf: false,
          path
        });
      });
      // for more detail, @see: http://swagger.io/specification/#operationObject
      const operationObject = pathItemObject[method];
      const api = swagger.getApiByOperationID(operationObject.operationId);

      api(query, {
        // TODO https://github.com/swagger-api/swagger-js/issues/1036 でやりたい
        requestInterceptor: (req) => {
          // TODO: `headers`とかでtokenのセットが可能か？？
          req.headers['Authorization'] = context.getter(constants.GETTER_ENDPOINTS_ONE, context.getter(constants.GETTER_CURRENT)).token;
          console.log('Interceptor(request):', req);
        },
        responseInterceptor: (res) => {
          console.log('Interceptor(response):', res);
        }
      }).then(res => {
        if (!res.ok) {
          return reject(`[fetch] ${res.url} error.`);
        }
        console.log(`[fetch] ${res.url} success.`);
        context.commit(constants.MUTATION_COMPONENTS_ONE, {
          response: res,
          operationObject,
          pathRefs,
          component,
          component_uid: component_uid
        });
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  },

  operate: (context, operationObject, query) => {
    const api = swagger.getApiByOperationID(operationObject.operationId);
    const token = context.getter(constants.GETTER_ENDPOINTS_ONE, context.getter(constants.GETTER_CURRENT)).token;

    // TODO: 共通化したいな
    return api(query, {
      requestInterceptor: (req) => {
        // TODO: queryに含めることは可能か..?
        req.headers['Authorization'] = token;
        console.log('Interceptor(request):', req);
      },
      responseInterceptor: (res) => {
        console.log('Interceptor(response):', res);
      }
    });
  },

  removeAll: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_COMPONENTS_REMOVE_ALL);
      });
  },

  removeOne: (context, component_uid) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_COMPONENTS_REMOVE_ONE, component_uid);
      });
  }

};
