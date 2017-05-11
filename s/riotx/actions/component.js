import { contains, forEach, unique } from 'mout/array';
import { forOwn } from 'mout/object';
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
      let executableOperationIDs = [];
      forOwn(pathItemObject, (operationObject, key) => {
        if (!contains(['get', 'put', 'post', 'delete', 'options', 'head', 'patch'], key)) {
          return;
        }
        if (key !== 'get') {
          executableOperationIDs.push(operationObject.operationId);
        }
        forEach(operationObject.tags || [], tag => {
          executableOperationIDs.push(tag);
        });
      });
      executableOperationIDs = unique(executableOperationIDs);
      const operationObject = swagger.client.spec.paths[path][method];
      const apis = swagger.apisFlatObject();
      const api = apis[operationObject.operationId];

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
            executableOperationIDs,
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
  }

};
