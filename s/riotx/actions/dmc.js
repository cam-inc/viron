import swagger from '../../swagger';

// APIは必須でサポートしなければならない URI
const DMC_URI = '/dmc';

export default {
  show: function (callback) {
    let dmcOID = swagger.client.spec.paths[DMC_URI].get.operationId;
    if (!dmcOID || !swagger.client.apis.dmc || !swagger.client.apis.dmc[dmcOID]) {
      return callback(new Error(`[fetch] ${swagger.client.url}; system entry point not found. (uri: ${DMC_URI})`), swagger.client);

    }

    swagger.client.apis.dmc[dmcOID]().then(res => {
      if (!res.ok) {
        return callback(new Error("[fetch] ${DMC_URI} error."), res);
      }

      console.log(`[fetch] ${DMC_URI} success.`);
      this.commit("dmc_show", res.obj);
      callback(null);
    }).catch(err => {
      return callback(err);
    });
  },
  remove: function (callback) {
    this.commit("dmc_remove");
    callback(null)
  }
}
