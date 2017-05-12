import { forEach } from 'mout/array';
import constants from '../../core/constants';
import swagger from '../../swagger';

export default {
  get: (context, component_uid, component_index, query = {}) => {
    return new Promise((resolve, reject) => {
      const component = context.state.page.components[component_index]; // TODO getters 化する

      let path = component.api.path.get();
      const method = component.api.method.get();

      if (path.indexOf('/') !== 0) {
        path = '/' + path;
      }

      if (!swagger.client.spec.paths[path] || !swagger.client.spec.paths[path][method]) {
        // TODO
        throw new Error(`[fetch] API define not found. ${path}/${method}`);
      }

      const pathItemObject = swagger.client.spec.paths[path];
      let pathRefs = [{
        isSelf: true,
        path
      }];
      forEach(pathItemObject['get']['x-ref'] || [], path => {
        pathRefs.push({
          isSelf: false,
          path
        });
      });
      const operationObject = swagger.client.spec.paths[path][method];
      const api = swagger.getApiByOperationID(operationObject.operationId);

      const token = context.getter(constants.GETTER_ENDPOINT_ONE, context.getter(constants.GETTER_CURRENT)).token;

      // TODO get only support
      api(query, {
        // TODO https://github.com/swagger-api/swagger-js/issues/1036 でやりたい
        requestInterceptor: (req) => {
          req.headers['Authorization'] = token;
          console.log('Interceptor(request):', req);
        },
        responseInterceptor: (res) => {
          console.log('Interceptor(response):', res);
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`[fetch] ${res.url} error.`);
          }
          console.log(`[fetch] ${res.url} success.`);
          resolve({
            response: res,
            operationObject,
            pathRefs,
            component,
            component_uid: component_uid
          });
        })
        .catch(err => {
          reject(err);
        });
    }).then(res => {
      context.commit(constants.MUTATION_COMPONENT_ONE, res);
    });
  },

  operate: (context, operationObject, query) => {
    const api = swagger.getApiByOperationID(operationObject.operationId);
    const token = context.getter(constants.GETTER_ENDPOINT_ONE, context.getter(constants.GETTER_CURRENT)).token;

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
  }

};
