import { lint as _lint } from '@viron/linter';
import { JSONPath } from 'jsonpath-plus';
import _ from 'lodash';
import { EnvironmentalVariable, isEnvironmentalVariable } from '~/constants';
import { Result, Success, Failure, BaseError, OASError } from '~/errors';
import { Endpoint, URL, Pathname } from '~/types';
import {
  Document,
  Info,
  Content,
  X_Number,
  X_Table,
  X_Autocomplete,
  PathTemplate,
  Paths,
  PathItem,
  Request,
  OperationId,
  Operation,
  Method,
  METHOD,
  Parameter,
  RequestValue,
  RequestParametersValue,
  RequestPayloads,
  Server,
  RequestPayloadParameter,
  RequestBody,
  RequestRequestBodyValue,
  RequestPayloadRequestBody,
  MediaTypes,
  MediaType,
  Schema,
  TableColumn,
  Sort,
  SORT,
} from '~/types/oas';
import { isRelativeURL } from '~/utils';
import { serialize } from '~/utils/oas/style';

// Check whether an OAS document is valid or not.
export const lint = (document: unknown): Result<null, BaseError> => {
  const result = _lint(document as Parameters<typeof _lint>[0]);
  if (result.isValid) {
    return new Success(null);
  } else {
    return new Failure(
      new OASError(result.errors?.[0].message || 'Invalid OAS document.')
    );
  }
};

// Resolve an OAS Document with tasks:
// - resolve all $ref objects
// - Assign an ID to all content objects.
// - Expand shared parameter objects.
// TODO: To support $ref values not starting with a # letter.
export const resolve = (document: Record<string, unknown>): Document => {
  document = _.cloneDeep(document);
  // Look for all reference objects(those that contain a $ref property.) and insert actual referenced data.
  JSONPath({
    path: '$..[?(@.$ref)]',
    json: document,
    resultType: 'all',
    callback: (result) => {
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
    callback: (result) => {
      delete result.parent[result.parentProperty].$ref;
    },
  });
  // Assign contentIds.
  (document as Document).info['x-pages'].forEach((page) => {
    page.contents = page.contents.map((content, idx) => {
      content.id = `${page.id}-${idx}`;
      return content;
    });
  });
  // Expand shared parameters.
  // @see: https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#path-item-object
  _.forEach((document as Document).paths, (pathItem) => {
    if (!pathItem.parameters) {
      return;
    }
    const operations = _.pick(pathItem, _.values(METHOD)) as Record<
      Method,
      Operation
    >;
    pathItem.parameters.forEach((sharedParameter) => {
      _.forEach(operations, (operation) => {
        if (!operation.parameters) {
          operation.parameters = [sharedParameter];
          return;
        }
        // Add when not overwritten.
        if (
          operation.parameters.find(
            (parameter) => parameter.name === sharedParameter.name
          )
        ) {
          return;
        } else {
          operation.parameters = [...operation.parameters, sharedParameter];
        }
      });
    });
  });
  return document as Document;
};

export const createFakeDocument = ({
  info,
  paths,
}: {
  info?: Info;
  paths?: Paths;
} = {}): Document => {
  info = info || {
    title: 'fake document',
    version: '0.0.0',
    'x-pages': [],
  };
  paths = paths || {};
  return {
    openapi: '3.0.2',
    info,
    paths,
  };
};

// Convert a path template string to a pathname string.
export const parsePathTemplate = (
  pathTemplate: PathTemplate,
  pathParams: { [key in string]: string }
): Pathname => {
  _.forEach(pathParams, (value, key) => {
    pathTemplate = pathTemplate.replace(`{${key}}`, value);
  });
  return pathTemplate as Pathname;
};

// Replace request values with viron environmental variables.
export const replaceWithEnvironmentalVariables = <
  T = Record<string, unknown>,
  U = string
>(
  target: any,
  replaces: Partial<Record<EnvironmentalVariable, U>>
): T => {
  target = _.cloneDeep(target);
  const recursive = (target: any): any => {
    if (_.isString(target)) {
      if (!isEnvironmentalVariable(target)) {
        return target;
      }
      const to = replaces[target];
      if (!to) {
        return target;
      }
      return to;
    }
    if (_.isPlainObject(target)) {
      _.forEach(target, (value, key) => {
        target[key] = recursive(value);
      });
      return target;
    }
    if (_.isArray(target)) {
      target = target.map((value) => recursive(value));
      return target;
    }
    return target;
  };
  return recursive(target) as T;
};

// Omit data that is not defined in OAS document.
export const cleanupRequestValue = (
  request: Request,
  rawRequestValue: RequestValue
): RequestValue => {
  const requestValue: RequestValue = {};
  if (request.operation.parameters && rawRequestValue.parameters) {
    const requestParametersValue: RequestParametersValue = {};
    request.operation.parameters.forEach((parameter) => {
      // TODO: TSの書き方を工夫してこのif文を消したい。
      if (!rawRequestValue.parameters) {
        return;
      }
      if (!_.isUndefined(rawRequestValue.parameters[parameter.name])) {
        requestParametersValue[parameter.name] =
          rawRequestValue.parameters[parameter.name];
      }
    });
    requestValue.parameters = requestParametersValue;
  }
  if (
    request.operation.requestBody &&
    !_.isUndefined(rawRequestValue.requestBody)
  ) {
    requestValue.requestBody = rawRequestValue.requestBody;
  }
  return requestValue;
};

// Returns a URL to the target host.
// TODO: Support Server Variables.
export const getURLToTargetHost = (
  endpoint: Endpoint,
  document: Document,
  { withTrailingSlash = false }: { withTrailingSlash?: boolean } = {
    withTrailingSlash: false,
  }
): URL => {
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

//
export const constructRequestInfo = (
  endpoint: Endpoint,
  document: Document,
  request: Request,
  requestPayloads: RequestPayloads
): RequestInfo => {
  const urlToTargetHost = getURLToTargetHost(endpoint, document);
  type PathParams = {
    [key in string]: string;
  };
  const pathParams = ((): PathParams => {
    const pathParams: PathParams = {};
    requestPayloads.parameters
      ?.filter((p) => p.in === 'path')
      .forEach((p) => {
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
  const queryParams = ((): QueryParams => {
    const queryParams: QueryParams = [];
    requestPayloads.parameters
      ?.filter((p) => p.in === 'query')
      .forEach((p) => {
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
  const pathname: string = parsePathTemplate(request.path, pathParams);
  let requestInfo: RequestInfo = `${urlToTargetHost}${pathname}`;
  const joinedQueryParams = queryParams.join('&');
  if (!!joinedQueryParams) {
    requestInfo = `${requestInfo}?${joinedQueryParams}`;
  }
  return requestInfo;
};

export const constructRequestInit = (
  request: Request,
  requestPayloads: RequestPayloads,
  options: {
    mode?: RequestInit['mode'];
    credentials?: RequestInit['credentials'];
    redirect?: RequestInit['redirect'];
  } = {}
): RequestInit => {
  const requestInit: RequestInit = {
    method: request.method,
    mode: 'cors',
    credentials: 'include',
    ...options,
  };
  type Headers = Record<string, string>;
  const headers = ((): Headers => {
    const headers: Headers = {};
    requestPayloads.parameters
      ?.filter((p) => p.in === 'header')
      .forEach((p) => {
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
      ?.filter((p) => p.in === 'cookie')
      .forEach((p) => {
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

export const constructRequestPayloads = (
  operation: Operation,
  requestValue: RequestValue
): RequestPayloads => {
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

export const constructRequestPayloadParameters = (
  parameters: Parameter[],
  requestParametersValue: RequestParametersValue
): RequestPayloadParameter[] => {
  const requestPayloadParameters: RequestPayloadParameter[] = [];
  _.forEach(requestParametersValue, (value, name) => {
    const parameter = parameters.find((p) => p.name === name);
    if (!parameter) {
      return;
    }
    requestPayloadParameters.push({ ...parameter, value });
  });
  return requestPayloadParameters;
};

export const constructRequestPayloadRequestBody = (
  requestBody: RequestBody,
  requestRequestBodyValue: RequestRequestBodyValue
): RequestPayloadRequestBody => {
  const requestPayloadRequestBody: RequestPayloadRequestBody = {
    ...requestBody,
    value: requestRequestBodyValue,
  };
  return requestPayloadRequestBody;
};

export const encord = (
  value: RequestPayloadRequestBody['value'],
  contentType: string,
  mediaType: MediaType
): string | URLSearchParams | FormData => {
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

export const pickMediaType = (mediaTypes: MediaTypes): MediaType => {
  const contentType = pickContentType(mediaTypes);
  return mediaTypes[contentType];
};

export const pickContentType = (mediaTypes: MediaTypes): string => {
  // TODO: pick the most specific key.
  return _.keys(mediaTypes)[0];
};

export const getDefaultValue = (schema: Schema): any => {
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
      _.forEach(schema.properties, (_schema, key) => {
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

// Returns Info['x-number'] object.
export const extractXNumber = (info: Info): Result<X_Number, BaseError> => {
  const xNumber = info['x-number'];
  if (!xNumber) {
    return new Failure(new OASError('Could not find number setting.'));
  }
  const { responseKey } = xNumber;
  if (!responseKey) {
    return new Failure(new OASError('responseKey key missed.'));
  }
  return new Success(xNumber);
};

// Returns Info['x-table'] object.
export const extractXTable = (info: Info): Result<X_Table, BaseError> => {
  const xTable = info['x-table'];
  if (!xTable) {
    return new Failure(new OASError('Could not find table setting.'));
  }
  const { responseListKey } = xTable;
  if (!responseListKey) {
    return new Failure(new OASError('responseListKey key missed.'));
  }
  return new Success(xTable);
};

// Returns Info['x-autocomplete'] object.
export const extractXAutocomplete = (
  info: Info
): Result<X_Autocomplete, BaseError> => {
  const xAutocomplete = info['x-autocomplete'];
  if (!xAutocomplete) {
    return new Failure(new OASError('Could not find autocomplete setting.'));
  }
  const { responseValueKey } = xAutocomplete;
  if (!responseValueKey) {
    return new Failure(new OASError('responseValueKey key missed.'));
  }
  return new Success(xAutocomplete);
};

// Returns PathItem object.
export const extractPathItem = (
  document: Document,
  pathTemplate: PathTemplate
): Result<PathItem, BaseError> => {
  const pathItem = document.paths[pathTemplate];
  if (!pathItem) {
    return new Failure(new OASError(`PathItem object not found.`));
  }
  return new Success(pathItem);
};

// Return Request object.
export const extractRequest = (
  document: Document,
  operationId: OperationId
): Result<Request, BaseError> => {
  let path: PathTemplate | null = null;
  let method: Method | null = null;
  let operation: Operation | null = null;
  _.forEach(document.paths, (_pathItem, _path) => {
    const _operations = _.pick(_pathItem, _.values(METHOD)) as Record<
      Method,
      Operation
    >;
    _.forEach(_operations, (_operation, _method) => {
      if (_operation.operationId === operationId) {
        path = _path as PathTemplate;
        method = _method as Method;
        operation = _operation as Operation;
      }
    });
  });
  if (!path || !method || !operation) {
    return new Failure(new OASError('Request not found.'));
  }
  return new Success({
    path,
    method,
    operation,
  });
};

// Returns Operation object.
export const extractOperation = (
  document: Document,
  operationId: OperationId
): Result<Operation, BaseError> => {
  const result = extractRequest(document, operationId);
  if (result.isFailure()) {
    return new Failure(result.value);
  }
  return new Success(result.value.operation);
};

// Returns Parameter object.
export const extractParameter = (
  operation: Operation,
  name: Parameter['name']
): Result<Parameter, BaseError> => {
  if (!operation.parameters) {
    return new Failure(new OASError('Parameters not found.'));
  }
  const parameter = operation.parameters.find(
    (parameter) => parameter.name === name
  );
  if (!parameter) {
    return new Failure(new OASError('Parameter not found.'));
  }
  return new Success(parameter);
};

// Returns all parameter keys.
export const extractParameters = (
  operation: Operation
): Result<Parameter[], BaseError> => {
  return new Success(operation.parameters || []);
};

//
export const extractTableColumns = (
  document: Document,
  content: Content
): Result<TableColumn[], BaseError> => {
  const extractXTableResult = extractXTable(document.info);
  if (extractXTableResult.isFailure()) {
    return new Failure(extractXTableResult.value);
  }
  const xTable = extractXTableResult.value;
  const columns: TableColumn[] = [];
  const fields = getContentBaseOperationResponseKeys(document, content);
  fields.forEach((field) => {
    columns.push({
      schema: field.schema,
      name: field.name,
      key: field.name,
      isSortable: !!xTable.sort?.requestKey,
      sort: SORT.NONE,
    });
  });
  return new Success(columns);
};

export const getTableRows = (
  document: Document,
  content: Content,
  data: any
): Record<string, any>[] => {
  const rows: Record<string, any>[] = [];
  const extractXTableResult = extractXTable(document.info);
  if (extractXTableResult.isFailure()) {
    return rows;
  }
  // TODO: response['200'].content['application/json'].schema.properties[{responseListKey}].items.typeって、objectかもしれないしnumberかもしれないよ。
  data[extractXTableResult.value.responseListKey].forEach(function (item: any) {
    const row: Record<string, any> = {};
    const fields = getContentBaseOperationResponseKeys(document, content);
    fields.forEach((field) => {
      row[field.name] = item[field.name];
    });
    rows.push(row);
  });
  return rows;
};

export const mergeTableSortRequestValue = (
  document: Document,
  request: Request,
  baseRequestValue: RequestValue,
  sorts: Record<TableColumn['key'], Sort>
): RequestValue => {
  const requestValue = _.cloneDeep<RequestValue>(baseRequestValue);
  const getTableSettingResult = extractXTable(document.info);
  if (getTableSettingResult.isFailure()) {
    return requestValue;
  }
  if (!getTableSettingResult.value.sort) {
    return requestValue;
  }
  const { requestKey } = getTableSettingResult.value.sort;
  const requestParameterResult = extractParameter(
    request.operation,
    requestKey
  );
  if (requestParameterResult.isFailure()) {
    return requestValue;
  }
  const requestParameter = requestParameterResult.value;
  // TODO: rquestParameter.schemaだけじゃなく、requestParameter.contentなパターンにも対応すること。
  if (requestParameter && requestParameter.schema) {
    switch (requestParameter.schema.type) {
      case 'string':
        requestValue.parameters = {
          ...requestValue.parameters,
          [requestKey]: (function (): string {
            const arr: string[] = [];
            _.forEach(sorts, function (sort, key) {
              if (sort === SORT.ASC || sort === SORT.DESC) {
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
          [requestKey]: (function (): Record<string, Sort> {
            return _.omitBy(sorts, function (sort) {
              if (sort === SORT.ASC || sort === SORT.DESC) {
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
              if (sort === SORT.ASC || sort === SORT.DESC) {
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
  const getTableSettingResult = extractXTable(document.info);
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

// This function doesn't return all keys in a response object. It guesses which key to be returned. For example if content.type is `table`, it collects all keys of a property specified by Info['x-table'].responseListKey.
export const getContentBaseOperationResponseKeys = (
  document: Document,
  content: Content
): { schema: Schema; name: string }[] => {
  const ret: { schema: Schema; name: string }[] = [];
  const getRequestResult = extractRequest(document, content.operationId);
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
      break;
  }
  return ret;
};

export const mergeAllOf = (schemas: NonNullable<Schema['allOf']>): Schema => {
  return _.merge({} as Schema, ...schemas);
};
