import _ from 'lodash';
import { Endpoint, URL } from '$types/index';
import {
  Document,
  Method,
  OperationId,
  Request,
  RequestBody,
  Schema,
  Server,
} from '$types/oas';
import { isRelativeURL } from '$utils/index';

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
  document: Document
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
  const { url } = server;
  if (isRelativeURL(url)) {
    return `${new window.URL(endpoint.url).origin}${url}`;
  }
  return url;
};

export const pickContentType = function (
  content: RequestBody['content']
): string {
  // TODO: pick the most specific key.
  return _.keys(content)[0];
};
