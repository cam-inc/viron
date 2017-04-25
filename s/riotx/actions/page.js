import swagger from '../../swagger';

import constants from '../../core/constants';

export default {
  show: (context, path, method, layout) => {
    return new Promise((resolve, reject) => {
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
      api()
        .then(res => {
          if (!res.ok) {
            throw new Error(`[fetch] ${res.url} error.`);
          }

          console.log(`[fetch] ${res.url} success.`);
          resolve({
            response: res.obj,
            model: model,
            layout: layout,
          });
        })
        .catch(err => {
          reject(err);
        });
    }).then(res => {
      context.commit(constants.MUTATION_PAGE_GET, res);
    });
  },
};
