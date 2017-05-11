import { get, forOwn } from 'mout/object';

import constants from '../core/constants';

/**
 * Swaggerファイルをロードして解析しデータ/操作を一元管理
 *
 * Tips: swagger-client(swagger-js) は、ブラウザの外部ファイル読み込み
 */

class Swagger {

  constructor() {
    this._endpoint = null;
    this.client = null;
  }

  setup(endpoint) {

    return new Promise((resolve, reject) => {
      const request = {
        url: endpoint.url || 'http://localhost:3000/swagger.json',
        //query,
        //method,
        //body,
        headers: {
          'Authorization': endpoint.token,
        },
        requestInterceptor: (req) => {
          console.log('Interceptor(request):', req);
        },
        responseInterceptor: (res) => {
          console.log('Interceptor(response):', res);
        }
      };

      this._endpoint = SwaggerClient.http(request);

      this._endpoint.then(client => {
        if (client.errors && 0 < client.errors.length) {
          return reject(client.errors);
        }
        if (client.status === 401) {
          const err = new Error()
          err.name = '401 Authorization Required';
          err.status = client.spec.status;
          return reject(err);
        }

        console.log(`[fetch] ${client.url} success.`);

        SwaggerClient({spec: client.body}).then((_client) => {
          this.client = _client;
          resolve();
        });

      }).catch(err => {
        return reject(err);
      });
    });
  }

  apisFlatObject() {
    if (!this.client) {
      return {};
    }
    const apis = {};
    forOwn(this.client.apis, (v) => {
      forOwn(v, (v1, k1) => {
        apis[k1] = v1;
      });
    });

    return apis;
  }

  getApiByOperationID(operationID) {
    return this.apisFlatObject()[operationID];
  }

  getOperationObjectByOperationID(operationID) {
    let operationObject;
    forOwn(this.client.spec.paths, pathItemObject => {
      forOwn(pathItemObject, v => {
        if (get(v, 'operationId') === operationID) {
          operationObject = v;
        }
      });
    });
    return operationObject;
  }

  getPathItemObjectByPath(path) {
    return this.client.spec.paths[path];
  }

  /**
   * 定義情報とデータをマージ
   * @param properties
   * @param response
   * @param key
   * @returns {*}
   */
  mergePropertiesAndResponse(properties, response, key) {
    if (properties.type === 'array') {
      let res = [];
      forOwn(response, (v, k) => {
        let ret = this.mergePropertiesAndResponse(properties.items, v, k);
        res.push(ret);
      });
      return res;
    }

    let res = {};

    if (properties.type === 'object') {
      forOwn(properties.properties, (v, k) => {
        let ret = this.mergePropertiesAndResponse(v, response[k], k);
        res[k] = ret;
      });
      return res;
    }

    //
    res.key = key;
    res.definition = properties;
    res.get = function () {
      return this.value;
    };

    // TODO definition チェッカー
    res.value = response;

    return res;

  }

  isComponentStyleNumber(obj) {
    return obj.get() === constants.STYLE_NUMBER;
  }

  isComponentStyleTable(obj) {
    return obj.get() === constants.STYLE_TABLE;
  }

  isComponentStyleGraphBar(obj) {
    return obj.get() === constants.STYLE_GRAPH_BAR;
  }

}

export default new Swagger();
