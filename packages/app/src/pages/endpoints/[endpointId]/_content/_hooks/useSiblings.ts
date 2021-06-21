import _ from 'lodash';
import { useMemo } from 'react';
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
  fetch: (requestValue: RequestValue) => Promise<{ data?: any; error?: Error }>;
}[];
// Sibling Opeartions are
// [1] operations whose path is the same as the base operation's one but method is different.
// [2] action operations whose request payload key set doesn't contain one of base operation's response payload keys.
const useSiblings = function (
  endpoint: Endpoint,
  document: Document,
  content: Info['x-pages'][number]['contents'][number]
): UseSiblingsReturn {
  const operationIds = useMemo<OperationId[]>(function () {
    const _operationIds: OperationId[] = [];
    const baseRequest = getRequest(document, {
      operationId: content.operationId,
    });
    if (!baseRequest) {
      return _operationIds;
    }
    const basePathItem = getPathItem(document, baseRequest.path);
    if (!basePathItem) {
      return _operationIds;
    }

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
          _.intersection(baseOperationResponseKeys, actionOperationRequestKeys)
            .length === 0
        ) {
          _operationIds.push(action.operationId);
        }
      });
    }
    return _operationIds;
  }, []);

  const siblings = useMemo<UseSiblingsReturn>(function () {
    const _siblings: UseSiblingsReturn = [];
    operationIds.forEach(function (operationId) {
      const request = getRequest(document, { operationId });
      if (!request) {
        return;
      }
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
          const [response, responseError] = await promiseErrorHandler<Response>(
            window.fetch(requestInfo, requestInit)
          );
          if (responseError) {
            // TODO: Error handling
            return { error: responseError };
          }
          if (!response.ok) {
            // TODO: Error handling
            return { error: new Error('response not ok.') };
          }
          const data = await response.json();
          return {
            data,
          };
        },
      });
    });
    return _siblings;
  }, operationIds);

  return siblings;
};
export default useSiblings;
