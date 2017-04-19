import swagger from '../../swagger';

// APIは必須でサポートしなければならない URI
const DMC_URI = '/dmc';

export default {
  show: mutate => {
    return new Promise((resolve, reject) => {
      const dmcOID = swagger.client.spec.paths[DMC_URI].get.operationId;
      if (!dmcOID || !swagger.client.apis.dmc || !swagger.client.apis.dmc[dmcOID]) {
        return reject(new Error(`[fetch] ${swagger.client.url}; system entry point not found. (uri: ${DMC_URI})`));
      }

      swagger.client.apis.dmc[dmcOID]()
        .then(res => {
          if (!res.ok) {
            throw new Error("[fetch] ${DMC_URI} error.");
          }

          console.log(`[fetch] ${DMC_URI} success.`);
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    })
      .then(res => {
        mutate('dmc_show', res.obj);
      });
  },
  remove: mutate => {
    return Promise
      .resolve()
      .then(() => {
        mutate('dmc_remove');
      });
  }
}
