import exporter from './exporter';

// OpenAPI Specificationに関する情報。
export default exporter('oas', {
  // SwaggerClientによって生成されたSwaggerClientインスタンス。
  // resolve済みのOpenAPI Document情報やhttpクライアント等が格納されている。
  // @see: https://github.com/swagger-api/swagger-js#constructor-and-methods
  client: null
});
