import constants from '../../core/constants';

import swagger from '../../swagger';

export default {
  get: (context, component_uid, component_index) => {
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

      const model = swagger.client.spec.paths[path][method];

      const apis = swagger.apisArray();
      const api = apis[model.operationId];

      const token = context.getter(constants.GETTER_ENDPOINT_ONE, context.getter(constants.GETTER_CURRENT)).token;

      api({/** TODO get only support. */}, {
        // TODO https://github.com/swagger-api/swagger-js/issues/1036 でやりたい
        requestInterceptor: (req) => {
          req.headers['Authorization'] = token;
          console.log('Interceptor(request):', req);
        },
        responseInterceptor: (res) => {
          console.log('Interceptor(response):', res);
        },
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`[fetch] ${res.url} error.`);
          }
          console.log(`[fetch] ${res.url} success.`);
          resolve({
            response: res.obj,
            model: model,
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
