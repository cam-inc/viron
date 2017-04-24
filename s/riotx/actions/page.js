import swagger from '../../swagger';

import constants from '../../core/constants';

export default {
  show: (context, id, operationId) => {
    return new Promise((resolve, reject) => {
      if (!swagger.client.apis[id] || !swagger.client.apis[id][operationId]) {
        // TODO
        throw new Error(`[fetch] API define not found. ${id}/${operationId}`);
      }
      const api = swagger.client.apis[id][operationId];
      api()
        .then(res => {
          if (!res.ok) {
            throw new Error(`[fetch] ${id}/${operationId} error.`);
          }

          console.log(`[fetch] ${id}/${operationId} success.`);
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    }).then(res => {
      context.commit(constants.MUTATION_PAGE_GET, res.obj);
    });
  },
};
