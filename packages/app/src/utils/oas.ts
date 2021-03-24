import _ from 'lodash';
import { Endpoint, Token, URL } from '$types/index';
import { Document, Method, Operation, OperationId, Server } from '$types/oas';
import { isRelativeURL, promiseErrorHandler } from '$utils/index';

export const getOperationByOperationId = function (
  document: Document,
  operationId: OperationId
): {
  // key must begin with a slash.
  path: string | null;
  method: Method | null;
  operation: Operation | null;
} {
  const result: {
    path: string | null;
    method: Method | null;
    operation: Operation | null;
  } = { path: null, method: null, operation: null };
  const path = _.findKey(document.paths, function (pathItem) {
    return pathItem.get?.operationId === operationId;
  });
  if (!path) {
    return result;
  }
  result.path = path;

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
    return result;
  }
  result.operation = operation;

  const method = _.findKey(operations, function (operation) {
    return operation?.operationId === operationId;
  });
  if (!method) {
    return result;
  }
  result.method = method as Method;

  return result;
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

export const fetchContentData = async function (
  endpoint: Endpoint,
  document: Document,
  getOperationId: OperationId
): Promise<[Response, Error | null]> {
  const { path } = getOperationByOperationId(document, getOperationId);
  return await promiseErrorHandler<Response>(
    fetch(`${getURLToTargetHost(endpoint, document)}${path}`, {
      mode: 'cors',
      headers: {
        Authorization: endpoint.token as Token,
      },
    })
  );
};
