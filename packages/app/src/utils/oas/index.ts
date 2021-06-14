import { lint as _lint, LintReturn } from '@viron/linter';
import { JSONPath } from 'jsonpath-plus';
import _ from 'lodash';
import { Endpoint, URL } from '$types/index';
import {
  Document,
  Info,
  Method,
  Operation,
  OperationId,
  Parameter,
  Paths,
  Request,
  RequestBody,
  RequestParametersValue,
  RequestPayloadParameter,
  RequestPayloadRequestBody,
  RequestPayloads,
  RequestRequestBodyValue,
  RequestValue,
  Server,
  Schema,
} from '$types/oas';
import { isRelativeURL } from '$utils/index';
import { serialize } from '$utils/oas/style';

// Check whether a OAS document is support by us.
export const lint = function (document: Record<string, unknown>): LintReturn {
  return _lint(document);
};

// TODO: To support $ref values not starting with a # letter.
export const resolve = function (document: Record<string, unknown>): Document {
  // Look for all reference objects(those that contains a $ref property.) and insert actual referenced data.
  JSONPath({
    path: '$..[?(@.$ref)]',
    json: document,
    resultType: 'all',
    callback: function (result) {
      const split = result.value.$ref.split('/');
      // Omit # letter.
      split.shift();
      const schemaResult = JSONPath({
        path: `$.${split.join('.')}`,
        json: document,
        resultType: 'all',
      })[0];
      if (!schemaResult) {
        return;
      }
      result.parent[result.parentProperty] = {
        ...result.parent[result.parentProperty],
        ...schemaResult.value,
      };
    },
  });
  // Clean up all $ref properties.
  JSONPath({
    path: '$..[?(@.$ref)]',
    json: document,
    resultType: 'all',
    callback: function (result) {
      delete result.parent[result.parentProperty].$ref;
    },
  });
  return document as Document;
};

export const constructFakeDocument = function ({
  info,
  paths,
}: { info?: Info; paths?: Paths } = {}): Document {
  info = info || {
    title: 'fake document',
    version: '0.0.0',
    'x-pages': [],
  };
  paths = paths || {};
  const doc: Document = {
    openapi: '3.0.2',
    info,
    paths,
  };
  return doc;
};

export const getRequest = function (
  document: Document,
  { operationId }: { operationId?: OperationId } = {}
): Request | null {
  if (!!operationId) {
    return getRequestByOperationId(document, operationId);
  }
  // Returns first found one.
  const pathItem = _.find(document.paths, function (value) {
    return !!value;
  });
  if (!pathItem) {
    return null;
  }
  let operation = _.find(pathItem, function (_, key) {
    // TODO: Methodを参照すること。
    return [
      'get',
      'put',
      'post',
      'delete',
      'options',
      'head',
      'patch',
      'trace',
    ].includes(key);
  });
  if (!operation) {
    return null;
  }
  operation = operation as Operation;
  if (!operation.operationId) {
    return null;
  }
  return getRequestByOperationId(document, operation.operationId);
};

export const getRequestByOperationId = function (
  document: Document,
  operationId: OperationId
): Request | null {
  const path = _.findKey(document.paths, function (pathItem) {
    const operations = _.pick(pathItem, [
      'get',
      'put',
      'post',
      'delete',
      'options',
      'head',
      'patch',
      'trace',
    ]);
    return !!_.find(operations, function (value) {
      if (!value) {
        return false;
      }
      return value.operationId === operationId;
    });
  });
  if (!path) {
    return null;
  }

  const operations = _.pick(document.paths[path], [
    'get',
    'put',
    'post',
    'delete',
    'options',
    'head',
    'patch',
    'trace',
  ]);
  const operation = _.find(operations, function (operation) {
    return operation?.operationId === operationId;
  });
  if (!operation) {
    return null;
  }

  const method = _.findKey(operations, function (operation) {
    return operation?.operationId === operationId;
  });
  if (!method) {
    return null;
  }

  return {
    path,
    method: method as Method,
    operation,
  };
};

export const parseURITemplate = function (
  template: string,
  pathParams: { [key in string]: string }
): string {
  _.forEach(pathParams, function (value, key) {
    template = template.replace(`{${key}}`, value);
  });
  return template;
};

export const constructDefaultValues = function (
  request: Request,
  values: RequestValue = {}
): RequestValue {
  const requestValue: RequestValue = {};
  if (!!request.operation.parameters && !!values.parameters) {
    const requestParametersValue: RequestParametersValue = {};
    request.operation.parameters.forEach(function (parameter) {
      if (!values.parameters) {
        return;
      }
      if (!_.isUndefined(values.parameters[parameter.name])) {
        requestParametersValue[parameter.name] =
          values.parameters[parameter.name];
      }
    });
    requestValue.parameters = requestParametersValue;
  }
  if (!!request.operation.requestBody && !_.isUndefined(values.requestBody)) {
    requestValue.requestBody = values.requestBody;
  }
  return requestValue;
};

export const constructRequestInfo = function (
  endpoint: Endpoint,
  document: Document,
  request: Request,
  requestPayloads: RequestPayloads
): RequestInfo {
  const urlToTargetHost: URL = getURLToTargetHost(endpoint, document);
  type PathParams = {
    [key in string]: string;
  };
  const pathParams: PathParams = (function (): PathParams {
    const pathParams: PathParams = {};
    if (!requestPayloads.parameters) {
      return pathParams;
    }
    requestPayloads.parameters
      .filter(function (p) {
        return p.in === 'path';
      })
      .forEach(function (p) {
        // The style value in parameter object defaults to `simple` when `in` value is `path`.
        const style = p.style || 'simple';
        // The explode value in parameter object defaults to `true` when `style` value is `form`.
        let explode: boolean;
        if (_.isUndefined(p.explode)) {
          if (style === 'form') {
            explode = true;
          } else {
            explode = false;
          }
        } else {
          explode = p.explode;
        }
        pathParams[p.name] = serialize(p.name, p.value, style, explode);
      });
    return pathParams;
  })();
  type QueryParams = string[];
  const queryParams: QueryParams = (function (): QueryParams {
    const queryParams: QueryParams = [];
    if (!requestPayloads.parameters) {
      return queryParams;
    }
    requestPayloads.parameters
      .filter(function (p) {
        return p.in === 'query';
      })
      .forEach(function (p) {
        // The style value in parameter object defaults to `form` when `in` value is `query`.
        const style = p.style || 'form';
        // The explode value in parameter object defaults to `true` when `style` value is `form`.
        // @see:https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#fixed-fields-10
        let explode: boolean;
        if (_.isUndefined(p.explode)) {
          if (style === 'form') {
            explode = true;
          } else {
            explode = false;
          }
        } else {
          explode = p.explode;
        }
        queryParams.push(serialize(p.name, p.value, style, explode));
      });
    return queryParams;
  })();
  const pathname: string = parseURITemplate(request.path, pathParams);
  let requestInfo: RequestInfo = `${urlToTargetHost}${pathname}`;
  const joinedQueryParams = queryParams.join('&');
  if (!!joinedQueryParams) {
    requestInfo = `${requestInfo}?${joinedQueryParams}`;
  }
  return requestInfo;
};

export const constructRequestInit = function (
  request: Request,
  requestPayloads: RequestPayloads,
  options: {
    mode?: RequestInit['mode'];
    credentials?: RequestInit['credentials'];
    redirect?: RequestInit['redirect'];
  } = {}
): RequestInit {
  const requestInit: RequestInit = {
    method: request.method,
    mode: 'cors',
    credentials: 'include',
    ...options,
  };
  const headers: Record<string, string> = (function (): Record<string, string> {
    const headers: Record<string, string> = {};
    if (!requestPayloads.parameters) {
      return headers;
    }
    requestPayloads.parameters
      .filter(function (p) {
        return p.in === 'header';
      })
      .forEach(function (p) {
        // The style value in parameter object defaults to `simple` when `in` value is `header`.
        const style = p.style || 'simple';
        // The explode value in parameter object defaults to `true` when `style` value is `form`.
        // @see:https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#fixed-fields-10
        let explode: boolean;
        if (_.isUndefined(p.explode)) {
          if (style === 'form') {
            explode = true;
          } else {
            explode = false;
          }
        } else {
          explode = p.explode;
        }
        headers[p.name] = serialize(p.name, p.value, style, explode);
      });
    requestPayloads.parameters
      .filter(function (p) {
        return p.in === 'cookie';
      })
      .forEach(function (p) {
        // The style value in parameter object defaults to `form` when `in` value is `cookie`.
        const style = p.style || 'form';
        // The explode value in parameter object defaults to `true` when `style` value is `form`.
        // @see:https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#fixed-fields-10
        let explode: boolean;
        if (_.isUndefined(p.explode)) {
          if (style === 'form') {
            explode = true;
          } else {
            explode = false;
          }
        } else {
          explode = p.explode;
        }
        // TODO: in='cookie'が複数ある場合への対応。
        // TODO: そもそもfetchでCookieリクエストヘッダーを指定できない説。
        headers['Cookie'] = serialize(p.name, p.value, style, explode);
      });
    return headers;
  })();
  requestInit.headers = headers;
  if (!!requestPayloads.requestBody) {
    const contentType = pickContentType(requestPayloads.requestBody.content);
    headers['Content-Type'] = contentType;
    requestInit.body = convert(requestPayloads.requestBody.value, contentType);
  }
  return requestInit;
};

export const constructRequestPayloads = function (
  operation: Operation,
  requestValue: RequestValue
): RequestPayloads {
  const requestPayloads: RequestPayloads = {};
  if (!!operation.parameters && !_.isUndefined(requestValue.parameters)) {
    requestPayloads.parameters = constructRequestPayloadParameters(
      operation.parameters,
      requestValue.parameters
    );
  }
  if (!!operation.requestBody && !_.isUndefined(requestValue.requestBody)) {
    requestPayloads.requestBody = constructRequestPayloadRequestBody(
      operation.requestBody,
      requestValue.requestBody
    );
  }
  return requestPayloads;
};

export const constructRequestPayloadParameters = function (
  parameters: Parameter[],
  requestParametersValue: RequestParametersValue
): RequestPayloadParameter[] {
  const requestPayloadParameters: RequestPayloadParameter[] = [];
  _.forEach(requestParametersValue, function (value, name) {
    const parameter = parameters.find(function (p) {
      return p.name === name;
    });
    if (!parameter) {
      return;
    }
    requestPayloadParameters.push({ ...parameter, value });
  });
  return requestPayloadParameters;
};

export const constructRequestPayloadRequestBody = function (
  requestBody: RequestBody,
  requestRequestBodyValue: RequestRequestBodyValue
): RequestPayloadRequestBody {
  const requestPayloadRequestBody: RequestPayloadRequestBody = {
    ...requestBody,
    value: requestRequestBodyValue,
  };
  return requestPayloadRequestBody;
};

export const convert = function (
  value: RequestPayloadRequestBody['value'],
  contentType: string
): string {
  switch (contentType) {
    case 'application/json':
      return JSON.stringify(value);
    case 'application/x-www-form-urlencoded':
      // TODO
      return JSON.stringify(value);
    case 'application/octet-stream':
      // TODO
      return JSON.stringify(value);
    case 'multipart/form-data':
      // TODO
      return JSON.stringify(value);
    case 'image/jpeg':
    case 'image/png':
      // TODO
      return JSON.stringify(value);
    default:
      throw new Error(`Media type not supported. ${contentType}`);
  }
};

// Returns a URL to the target host.
// TODO: Support Server Variables.
export const getURLToTargetHost = function (
  endpoint: Endpoint,
  document: Document,
  { withTrailingSlash = false }: { withTrailingSlash?: boolean } = {
    withTrailingSlash: false,
  }
): URL {
  // Default to `{ url: '/' }` when no ServerObject is specified.
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#openapi-object
  let server: Server;
  if (Array.isArray(document.servers) && !!document.servers.length) {
    server = document.servers[0];
  } else {
    server = { url: '/' };
  }
  // If the url of the server object is relative, prefix with the origin of the server where the OpenAPI document is being served.
  let { url } = server;
  if (isRelativeURL(url)) {
    url = `${new window.URL(endpoint.url).origin}${url}`;
  }
  if (withTrailingSlash && !_.endsWith(url, '/')) {
    url = `/${url}`;
  } else if (!withTrailingSlash && _.endsWith(url, '/')) {
    url = _.trimEnd(url, '/');
  }
  return url;
};

export const pickContentType = function (
  content: RequestBody['content']
): string {
  // TODO: pick the most specific key.
  return _.keys(content)[0];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDefaultValue = function (schema: Schema): any {
  if (!_.isUndefined(schema.default)) {
    return schema.default;
  }
  // TODO: format等に合わせてより正確に。
  // TODO: requiredも考慮。
  switch (schema.type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'integer':
      return 0;
    case 'boolean':
      return false;
    case 'object': {
      const ret: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key in string]: any;
      } = {};
      _.forEach(schema.properties, function (_schema, key) {
        if ((schema.required || []).includes(key)) {
          ret[key] = getDefaultValue(_schema);
        }
      });
      return ret;
    }
    case 'array':
      return [];
  }
};
