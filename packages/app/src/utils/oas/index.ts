//import $RefParser from '@apidevtools/json-schema-ref-parser';
import { /*lint,*/ LintReturn } from '@viron/linter';
import { JSONPath } from 'jsonpath-plus';
import _ from 'lodash';
import { Endpoint, URL } from '$types/index';
import {
  Document,
  Method,
  OperationId,
  Request,
  RequestBody,
  Server,
  Schema,
} from '$types/oas';
import { isRelativeURL } from '$utils/index';

// Check whether a OAS document is support by us.
export const isOASSupported = function (
  document: Record<string, unknown>
): LintReturn {
  return {
    isValid: !!document,
    errors: [],
  };
  //return lint(document);
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

export const getRequestObject = function (
  document: Document,
  { operationId }: { operationId?: OperationId }
): Request | null {
  if (!!operationId) {
    return getRequestObjectByOperationId(document, operationId);
  }
  return null;
};

export const getRequestObjectByOperationId = function (
  document: Document,
  operationId: OperationId
): Request | null {
  const path = _.findKey(document.paths, function (pathItem) {
    return pathItem.get?.operationId === operationId;
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
