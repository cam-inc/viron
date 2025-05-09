import _ from 'lodash';
import { useMemo } from 'react';
import { BaseError, getHTTPError, NetworkError } from '@/errors';
import { Endpoint } from '@/types';
import {
  Document,
  Info,
  Method,
  OperationId,
  Request,
  RequestValue,
} from '@/types/oas';
import { promiseErrorHandler } from '@/utils';
import {
  extractPathItem,
  extractRequest,
  extractParameters,
  cleanupRequestValue,
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
  getContentBaseOperationResponseKeys,
} from '@/utils/oas';

export type UseSiblingsReturn = {
  request: Request;
  defaultValues: ReturnType<typeof cleanupRequestValue>;
  fetch: (
    requestValue: RequestValue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<{ data?: any; error?: BaseError }>;
}[];
// Sibling Opeartions are
// [1] operations whose path is the same as the base operation's one but method is different.
// [2] action operations whose request payload key set doesn't contain one of base operation's response payload keys.
const useSiblings = (
  endpoint: Endpoint,
  document: Document,
  content: Info['x-pages'][number]['contents'][number]
): UseSiblingsReturn => {
  const operationIds = useMemo<OperationId[]>(() => {
    const _operationIds: OperationId[] = [];
    const getBaseRequestResult = extractRequest(document, content.operationId);
    if (getBaseRequestResult.isFailure()) {
      return _operationIds;
    }
    const baseRequest = getBaseRequestResult.value;
    const getBasePathItemResult = extractPathItem(document, baseRequest.path);
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
    ).forEach((method) => {
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
      content.actions.forEach((action) => {
        const extractRequestResult = extractRequest(
          document,
          action.operationId
        );
        if (extractRequestResult.isFailure()) {
          return;
        }
        const extractParametersResult = extractParameters(
          extractRequestResult.value.operation
        );
        if (extractParametersResult.isFailure()) {
          return;
        }
        const actionOperationRequestKeys = extractParametersResult.value.map(
          (parameter) => parameter.name
        );
        if (
          _.intersection(
            baseOperationResponseKeys.map((item) => item.name),
            actionOperationRequestKeys
          ).length === 0
        ) {
          _operationIds.push(action.operationId);
        }
      });
    }
    return _operationIds;
  }, [document, content]);

  const siblings = useMemo<UseSiblingsReturn>(() => {
    const _siblings: UseSiblingsReturn = [];
    operationIds.forEach((operationId) => {
      const getRequestResult = extractRequest(document, operationId);
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
        fetch: async (requestValue: RequestValue) => {
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
            globalThis.fetch(requestInfo, requestInit)
          );
          if (responseError) {
            return { error: new NetworkError(undefined) };
          }
          if (!response.ok) {
            return { error: await getHTTPError(response) };
          }

          const contentDisposition = response.headers.get(
            'content-disposition'
          );
          if (contentDisposition && requestInit.method === 'get') {
            await response.blob().then((blob) => {
              const blobURL = globalThis.URL.createObjectURL(blob);
              const elm = globalThis.document.createElement('a');
              elm.download =
                contentDisposition
                  .split('filename=')[1]
                  .split(';')[0]
                  .replace(/['"]/g, '') || 'download';
              elm.href = blobURL;
              elm.style.display = 'none';
              globalThis.document.body.appendChild(elm);
              elm.click();
              // clean up.
              globalThis.document.body.removeChild(elm);
              globalThis.URL.revokeObjectURL(blobURL);
            });
            return {
              data: null,
            };
          }
          const data = await response.json();
          return {
            data,
          };
        },
      });
    });
    return _siblings;
  }, [content, endpoint, document, operationIds]);

  return siblings;
};
export default useSiblings;
