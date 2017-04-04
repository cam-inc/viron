/**
 * Swaggerファイルをロードして解析しデータ/操作を一元管理
 *
 * Tips: swagger-client(swagger-js) は、ブラウザの外部ファイル読み込み
 */

class Swagger {

  constructor() {
    this._endpoint = null;
    this._client = null;
    this._dmc = null;
    this.setuped = false
  }

  getPage() {
    return this._dmc.body.pages
  }

  getName() {
    return this._dmc.body.name
  }

  setup(url, callback) {
    const request = {
      url: url || 'http://localhost:8080/swagger.json',
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
      // Tips: dmc_show は仕様で必須
      if (!client.apis.dmc || !client.apis.dmc["dmc#show"]) {
        return callback(new Error(`Fetching resource list: ${client.url}; system entry point not found. (uri: /dmc)`), client);

      }
      console.log(`Fetching resource list: ${client.url}; Success.`)
      client.apis.dmc["dmc#show"]().then(res => {
        this._dmc = res;
        this._client = client;
        this.setuped = true;
        callback(null, this);
      });
    });

  }
}

export default new Swagger();
