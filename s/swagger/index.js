import { forOwn } from 'mout/object';

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

  setup(url) {
    return new Promise((resolve, reject) => {
      const request = {
        url: url || 'http://localhost:3000/swagger.json',
        //query,
        //method,
        //body,
        //headers,
        requestInterceptor: (req) => {
          console.log('Interceptor(request):', req);
        },
        responseInterceptor: (res) => {
          console.log('Interceptor(response):', res);
        }
      };

      this._endpoint = SwaggerClient(request.url);

      this._endpoint.then(client => {

        if (client.errors && 0 < client.errors.length) {
          return reject(client.errors);
        }

        console.log(`[fetch] ${client.url} success.`);
        this.client = client;

        resolve();

      }).catch(err => {
        return reject(err);
      });
    });
  }

  apisArray() {
    if (!this.client) {
      return [];
    }
    let apis = {};
    forOwn(this.client.apis, (v) => {
      forOwn(v, (v1, k1) => {
        apis[k1] = v1;
      });
    });

    return apis;

  }

  isComponentStyleNumber(obj) {
    return obj.value == constants.STYLE_NUMBER;
  }
  isComponentStyleTable(obj) {
    return obj.value == constants.STYLE_TABLE;
  }

  getStringValue(obj) {
    // TODO チェック入れる
    return obj.value;
  }
}

export default new Swagger();
