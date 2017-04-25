import constants from '../../core/constants';

import swagger from '../../swagger';

// APIは必須でサポートしなければならない URI
const DMC_URI = '/dmc';

export default {
  show: context => {
    return new Promise((resolve, reject) => {
      const model = swagger.client.spec.paths[DMC_URI].get;

      if (!model || !swagger.client.apis.dmc || !swagger.client.apis.dmc[model.operationId]) {
        return reject(new Error(`[fetch] ${swagger.client.url}; system entry point not found. (uri: ${DMC_URI})`));
      }

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
          });
        })
        .catch(err => {
          reject(err);
        });
    }).then(res => {
      context.commit(constants.MUTATION_DMC, res);
    });
  },
  remove: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_DMC_REMOVE);
      });
  }
}
