import _ from 'lodash';
import { useMemo } from 'react';
import { HTTPStatusCode } from '$constants/index';
import { BaseError, getHTTPError, NetworkError } from '$errors/index';
import { Endpoint } from '$types/index';
import {
  Document,
  Info,
  Method,
  OperationId,
  Request,
  RequestValue,
} from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import {
  cleanupRequestValue,
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
  getContentBaseOperationResponseKeys,
  getPathItem,
  getRequest,
  getRequestParameterKeys,
} from '$utils/oas';

export type UseSiblingsReturn = {
  request: Request;
  defaultValues: ReturnType<typeof cleanupRequestValue>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetch: (
    requestValue: RequestValue
  ) => Promise<{ data?: any; error?: BaseError }>;
}[];
// Sibling Opeartions are
// [1] operations whose path is the same as the base operation's one but method is different.
// [2] action operations whose request payload key set doesn't contain one of base operation's response payload keys.
const useSiblings = function (
  endpoint: Endpoint,
  document: Document,
  content: Info['x-pages'][number]['contents'][number]
): UseSiblingsReturn {
  const operationIds = useMemo<OperationId[]>(
    function () {
      const _operationIds: OperationId[] = [];
      const getBaseRequestResult = getRequest(document, {
        operationId: content.operationId,
      });
      if (getBaseRequestResult.isFailure()) {
        return _operationIds;
      }
      const baseRequest = getBaseRequestResult.value;
      const getBasePathItemResult = getPathItem(document, baseRequest.path);
      if (getBasePathItemResult.isFailure()) {
        return _operationIds;
      }
      const basePathItem = getBasePathItemResult.value;

      // Add operations under the rule of [1] described above.
      // TODO: method一覧の扱い改善。
      (
        [
          'get',
          'put',
          'post',
          'delete',
          'options',
          'head',
          'patch',
          'trace',
        ] as Method[]
      ).forEach(function (method) {
        if (method === baseRequest.method) {
          return;
        }
        const operationId = basePathItem[method]?.operationId;
        if (!operationId) {
          return;
        }
        _operationIds.push(operationId);
      });

      // Add operations under the rule of [2] described above.
      if (content.actions) {
        const baseOperationResponseKeys = getContentBaseOperationResponseKeys(
          document,
          content
        );
        content.actions.forEach(function (action) {
          const actionOperationRequestKeys = getRequestParameterKeys(
            document,
            action.operationId
          );
          if (
            _.intersection(
              baseOperationResponseKeys.map(function (item) {
                return item.name;
              }),
              actionOperationRequestKeys
            ).length === 0
          ) {
            _operationIds.push(action.operationId);
          }
        });
      }
      return _operationIds;
    },
    [document, content]
  );

  const siblings = useMemo<UseSiblingsReturn>(
    function () {
      const _siblings: UseSiblingsReturn = [];
      operationIds.forEach(function (operationId) {
        const getRequestResult = getRequest(document, { operationId });
        if (getRequestResult.isFailure()) {
          return;
        }
        const request = getRequestResult.value;
        _siblings.push({
          request,
          defaultValues: cleanupRequestValue(request, {
            parameters: content.defaultParametersValue,
            requestBody: content.defaultRequestBodyValue,
          }),
          fetch: async function (requestValue: RequestValue) {
            const requestPayloads = constructRequestPayloads(
              request.operation,
              requestValue
            );
            const requestInfo = constructRequestInfo(
              endpoint,
              document,
              request,
              requestPayloads
            );
            const requestInit = constructRequestInit(request, requestPayloads);
            const [response, responseError] =
              await promiseErrorHandler<Response>(
                window.fetch(requestInfo, requestInit)
              );
            if (responseError) {
              return { error: new NetworkError() };
            }
            if (!response.ok) {
              return { error: getHTTPError(response.status as HTTPStatusCode) };
            }
            const data = await response.json();
            return {
              data,
            };
          },
        });
      });
      return _siblings;
    },
    [content, endpoint, document, operationIds]
  );

  return siblings;
};
export default useSiblings;
