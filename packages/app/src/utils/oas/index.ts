import { lint as _lint, LintReturn } from '@viron/linter';
import { JSONPath } from 'jsonpath-plus';
import _ from 'lodash';
import { EnvironmentalVariable } from '~/constants';
import { Failure, OASError, Result, Success } from '~/errors';
import { Endpoint, URL } from '~/types';
import {
  Content,
  Document,
  Encoding,
  Info,
  MediaType,
  Method,
  METHOD,
  Operation,
  OperationId,
  Parameter,
  PathItem,
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
  TableColumn,
  TableSort,
  TABLE_SORT,
  X_Autocomplete,
  X_Table,
} from '~/types/oas';
import { isRelativeURL } from '~/utils';
import { serialize } from '~/utils/oas/style';

// Check whether a OAS document is support by us.
export const lint = function (document: unknown): LintReturn {
  return _lint(document as Parameters<typeof _lint>[0]);
};

// TODO: To support $ref values not starting with a # letter.
export const resolve = function (document: Record<string, unknown>): Document {
  document = _.cloneDeep(document);
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
  // Assign contentIds.
  (document as Document).info['x-pages'].forEach(function (page) {
    page.contents.forEach(function (content, idx) {
      content.id = `${page.id}-${idx}`;
    });
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

export const getNumber = function (data: any): Result<number, OASError> {
  if (typeof data !== 'number') {
    return new Failure(new OASError('TODO'));
  }
  return new Success(data);
};

export const getTableSetting = function (
  info: Info
): Result<X_Table, OASError> {
  if (!info['x-table'] || !info['x-table'].responseListKey) {
    return new Failure(new OASError('TODO'));
  }
  return new Success(info['x-table']);
};

export const getTableColumns = function (
  document: Document,
  content: Info['x-pages'][number]['contents'][number]
): TableColumn[] {
  const columns: TableColumn[] = [];
  const getTableSettingResult = getTableSetting(document.info);
  if (getTableSettingResult.isFailure()) {
    return columns;
  }
  const isSortable = !!getTableSettingResult.value.sort;
  const fields = getContentBaseOperationResponseKeys(document, content);
  fields.forEach(function (field) {
    columns.push({
      schema: field.schema,
      name: field.name,
      key: field.name,
      isSortable,
    });
  });
  return columns;
};

export const getTableRows = function (
  document: Document,
  content: Info['x-pages'][number]['contents'][number],
  data: any
): Record<string, any>[] {
  const rows: Record<string, any>[] = [];
  const getTableSettingResult = getTableSetting(document.info);
  if (getTableSettingResult.isFailure()) {
    return rows;
  }
  // TODO: response['200'].content['application/json'].schema.properties[{responseListKey}].items.typeって、objectかもしれないしnumberかもしれないよ。
  data[getTableSettingResult.value.responseListKey].forEach(function (
    item: any
  ) {
    const row: Record<string, any> = {};
    const fields = getContentBaseOperationResponseKeys(document, content);
    fields.forEach(function (field) {
      row[field.name] = item[field.name];
    });
    rows.push(row);
  });
  return rows;
};

export const mergeTableSortRequestValue = function (
  document: Document,
  request: Request,
  baseRequestValue: RequestValue,
  sorts: Record<TableColumn['key'], TableSort>
): RequestValue {
  const requestValue = _.cloneDeep<RequestValue>(baseRequestValue);
  const getTableSettingResult = getTableSetting(document.info);
  if (getTableSettingResult.isFailure()) {
    return requestValue;
  }
  if (!getTableSettingResult.value.sort) {
    return requestValue;
  }
  const { requestKey } = getTableSettingResult.value.sort;
  const requestParameter = getRequestParameter(request.operation, requestKey);
  // TODO: rquestParameter.schemaだけじゃなく、requestParameter.contentなパターンにも対応すること。
  if (requestParameter && requestParameter.schema) {
    switch (requestParameter.schema.type) {
      case 'string':
        requestValue.parameters = {
          ...requestValue.parameters,
          [requestKey]: (function (): string {
            const arr: string[] = [];
            _.forEach(sorts, function (sort, key) {
              if (sort === TABLE_SORT.ASC || sort === TABLE_SORT.DESC) {
                arr.push(`${key}:${sort}`);
              }
            });
            return arr.join(',');
          })(),
        };
        break;
      case 'object':
        requestValue.parameters = {
          ...requestValue.parameters,
          [requestKey]: (function (): Record<string, TableSort> {
            return _.omitBy(sorts, function (sort) {
              if (sort === TABLE_SORT.ASC || sort === TABLE_SORT.DESC) {
                return false;
              }
              return true;
            });
          })(),
        };
        break;
      case 'array':
        requestValue.parameters = {
          ...requestValue.parameters,
          [requestKey]: (function (): string[] {
            const arr: string[] = [];
            _.forEach(sorts, function (sort, key) {
              if (sort === TABLE_SORT.ASC || sort === TABLE_SORT.DESC) {
                arr.push(`${key}:${sort}`);
              }
            });
            return arr;
          })(),
        };
        break;
      case 'number':
      case 'integer':
      case 'boolean':
        break;
    }
  }
  // TODO: requestBodyにも対応すること。
  return requestValue;
};

export const mergeTablePagerRequestValue = function (
  document: Document,
  baseRequestValue: RequestValue,
  page: number
): RequestValue {
  const requestValue = _.cloneDeep<RequestValue>(baseRequestValue);
  const getTableSettingResult = getTableSetting(document.info);
  if (getTableSettingResult.isFailure()) {
    return requestValue;
  }
  const requestPageKey = getTableSettingResult.value.pager?.requestPageKey;
  if (!requestPageKey) {
    return requestValue;
  }
  requestValue.parameters = {
    ...requestValue.parameters,
    [requestPageKey]: page,
  };
  // TODO: requestBodyにも対応すること。
  return requestValue;
};

export const getAutocompleteSetting = function (
  info: Info
): Result<X_Autocomplete, OASError> {
  if (!info['x-autocomplete'] || !info['x-autocomplete'].responseValueKey) {
    return new Failure(new OASError('TODO'));
  }
  return new Success(info['x-autocomplete']);
};

export const getPathItem = function (
  document: Document,
  path: string
): Result<PathItem, OASError> {
  if (!document.paths[path]) {
    return new Failure(new OASError('TODO'));
  }
  return new Success(document.paths[path]);
};

export const getRequest = function (
  document: Document,
  { operationId }: { operationId?: OperationId } = {}
): Result<Request, OASError> {
  if (operationId) {
    return getRequestByOperationId(document, operationId);
  }
  // Returns first found one.
  const pathItem = _.find(document.paths, function (value) {
    return !!value;
  });
  if (!pathItem) {
    return new Failure(new OASError('TODO'));
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
    return new Failure(new OASError('TODO'));
  }
  operation = operation as Operation;
  if (!operation.operationId) {
    return new Failure(new OASError('TODO'));
  }
  return getRequestByOperationId(document, operation.operationId);
};

export const getRequestByOperationId = function (
  document: Document,
  operationId: OperationId
): Result<Request, OASError> {
  const path = _.findKey(document.paths, function (pathItem) {
    const operations = _.pick(pathItem, _.values(METHOD));
    return !!_.find(operations, function (operation) {
      if (!operation) {
        return false;
      }
      return operation.operationId === operationId;
    });
  });
  if (!path) {
    return new Failure(new OASError('TODO'));
  }

  const pathItem = document.paths[path];
  const operations = _.pick(pathItem, _.values(METHOD));
  const operation = _.find(operations, function (operation) {
    return operation?.operationId === operationId;
  });
  const method = _.findKey(operations, function (operation) {
    return operation?.operationId === operationId;
  });
  if (!operation) {
    return new Failure(new OASError('TODO'));
  }
  if (!method) {
    return new Failure(new OASError('TODO'));
  }
  const request: Request = {
    path,
    method: method as Method,
    operation: _.cloneDeep(operation),
  };
  if (pathItem.parameters) {
    const parameters: Parameter[] = request.operation.parameters || [];
    pathItem.parameters.forEach(function (parameter) {
      if (
        !parameters.find(function (_parameter) {
          return _parameter.name === parameter.name;
        })
      ) {
        parameters.push(parameter);
      }
    });
    request.operation.parameters = parameters;
  }
  return new Success(request);
};

export const getRequestParameter = function (
  operation: Operation,
  name: Parameter['name']
): Parameter | null {
  if (!operation.parameters) {
    return null;
  }
  const parameter = operation.parameters.find(function (p) {
    return p.name === name;
  });
  if (!parameter) {
    return null;
  }
  return parameter;
};

export const getRequestParameterKeys = function (
  document: Document,
  operationId: OperationId
): string[] {
  const ret: string[] = [];
  const getRequestResult = getRequest(document, {
    operationId,
  });
  if (getRequestResult.isFailure()) {
    return ret;
  }
  const request = getRequestResult.value;
  if (!request.operation.parameters) {
    return ret;
  }
  ret.push(
    ...request.operation.parameters.map(function (parameter) {
      return parameter.name;
    })
  );
  return ret;
};

// This function doesn't return all keys in a response object. It guesses which key to be returned. For example if content.type is `table`, it collects all keys of a property specified by Info['x-table'].responseListKey.
export const getContentBaseOperationResponseKeys = function (
  document: Document,
  content: Info['x-pages'][number]['contents'][number]
): { schema: Schema; name: string }[] {
  const ret: { schema: Schema; name: string }[] = [];
  const getRequestResult = getRequest(document, {
    operationId: content.operationId,
  });
  if (getRequestResult.isFailure()) {
    return ret;
  }
  const request = getRequestResult.value;
  if (!request.operation.responses) {
    return ret;
  }
  // TODO: defaultや他status codeも考慮すること。
  const response = request.operation.responses['200'];
  if (!response || !response.content) {
    return ret;
  }
  const mediaType = pickMediaType(response.content);
  if (!mediaType.schema) {
    return ret;
  }
  let schema = mediaType.schema;
  if (schema.allOf) {
    schema = mergeAllOf(schema.allOf);
  }
  switch (content.type) {
    case 'table': {
      if (!schema.properties) {
        return ret;
      }
      const listKey = document.info['x-table']?.responseListKey;
      if (!listKey) {
        return ret;
      }
      const properties = schema.properties[listKey].items?.properties;
      if (!properties) {
        return ret;
      }
      _.keys(properties).forEach(function (key) {
        ret.push({
          schema: properties[key],
          name: key,
        });
      });
      break;
    }
    case 'number':
    case 'custom':
      break;
  }
  return ret;
};

export const mergeAllOf = function (
  schemas: NonNullable<Schema['allOf']>
): Schema {
  return _.merge({} as Schema, ...schemas);
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

export const replaceEnvironmentalVariableOfDefaultRequestParametersValue =
  function <T>(
    defaultParametersValue: RequestParametersValue,
    replaces: Partial<Record<EnvironmentalVariable, T>>
  ): RequestParametersValue {
    const requestParametersValue: RequestParametersValue = _.cloneDeep(
      defaultParametersValue
    );
    _.forEach(replaces, function (to, environmentalVariable) {
      if (typeof to !== 'string') {
        return;
      }
      _.forEach(requestParametersValue, function (value, key) {
        if (typeof value !== 'string') {
          return;
        }
        requestParametersValue[key] = value.replace(environmentalVariable, to);
      });
    });
    return requestParametersValue;
  };

export const cleanupRequestValue = function (
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
        let explode = p.explode;
        if (_.isUndefined(p.explode)) {
          if (style === 'form') {
            explode = true;
          } else {
            explode = false;
          }
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
    // Do not explicitly set the Content-Type header on the request. Doing so will prevent the browser from being able to set the Content-Type header with the boundary expression it will use to delimit form fields in the request body.
    if (contentType !== 'multipart/form-data') {
      headers['Content-Type'] = contentType;
    }
    requestInit.body = encord(
      requestPayloads.requestBody.value,
      contentType,
      requestPayloads.requestBody.content[contentType]
    );
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

export const encord = function (
  value: RequestPayloadRequestBody['value'],
  contentType: string,
  mediaType: MediaType
): string | URLSearchParams | FormData {
  switch (contentType) {
    case 'application/octet-stream':
    case 'application/json':
      return JSON.stringify(value);
    case 'application/x-www-form-urlencoded': {
      // @see: https://datatracker.ietf.org/doc/html/rfc1866#section-8.2.1
      const ret: string[] = [];
      Object.entries(value).forEach(([key, value]) => {
        const encoding = mediaType.encoding?.[key];
        // The property with the key in the root schema shall exist whenever with this content type.
        const schema = mediaType.schema.properties?.[key] as Schema;
        // The behavior follows the same values as query parameters, including default values.
        const style = encoding?.style || 'form';
        let explode = encoding?.explode;
        if (_.isUndefined(explode)) {
          if (style === 'form') {
            explode = true;
          } else {
            explode = false;
          }
        }
        ret.push(serialize(key, value, style, explode));
      });
      return ret.join('&');
    }
    case 'multipart/form-data': {
      const ret = new FormData();
      Object.entries(value).forEach(([key, value]) => {
        ret.append(key, value as string | Blob);
      });
      return ret;
    }
    // TODO: サポートすべき？
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

export const pickMediaType = function (content: Content): MediaType {
  const contentType = pickContentType(content);
  return content[contentType];
};

export const pickContentType = function (content: Content): string {
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
