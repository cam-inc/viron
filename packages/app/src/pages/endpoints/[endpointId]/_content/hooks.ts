import _ from 'lodash';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Endpoint } from '$types/index';
import {
  Document,
  Info,
  Method,
  OperationId,
  Request,
  RequestPayloadParameter,
  RequestPayloadRequestBody,
  RequestValue,
} from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import {
  constructDefaultValues,
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
  getPathItem,
  getRequest,
  pickMediaType,
} from '$utils/oas';

export const useContent = function <R>(
  endpoint: Endpoint,
  document: Document,
  content: Info['x-pages'][number]['contents'][number]
): {
  isPending: boolean;
  error: Error | null;
  response: Response | null;
  responseJson: R | null;
  fetch: (options?: {
    requestPayloadParameters?: RequestPayloadParameter[];
    requestPayloadRequestBody?: RequestPayloadRequestBody;
  }) => Promise<void>;
  request: Request | null;
  requestValue: RequestValue;
  setRequestValue: Dispatch<SetStateAction<RequestValue>>;
  relatedOperationIds: OperationId[];
} {
  const request = getRequest(document, { operationId: content.operationId });
  if (!request) {
    throw new Error('request object not found.');
  }
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<Response | null>(null);
  const [responseJson, setResponseJson] = useState<R | null>(null);

  const [requestValue, setRequestValue] = useState<RequestValue>(
    constructDefaultValues(request, {
      parameters: content.defaultParametersValue,
      requestBody: content.defaultRequestBodyValue,
    })
  );

  const fetch = useCallback(
    async function () {
      if (!request) {
        return;
      }
      setIsPending(true);
      setResponse(null);
      setResponseJson(null);
      setError(null);

      const requestPayloads = constructRequestPayloads(
        request.operation,
        requestValue
      );
      const requestInfo: RequestInfo = constructRequestInfo(
        endpoint,
        document,
        request,
        requestPayloads
      );
      const requestInit: RequestInit = constructRequestInit(
        request,
        requestPayloads
      );
      const [response, responseError] = await promiseErrorHandler<Response>(
        window.fetch(requestInfo, requestInit)
      );

      if (!!responseError) {
        // Network error occured.
        setError(responseError);
        setIsPending(false);
        return;
      }
      if (!response.ok) {
        // The authorization cookie is not valid or any other reasons.
        setError(new Error(`${response.status}: ${response.statusText}`));
        setIsPending(false);
        return;
      }
      setResponse(response);
      const json = await response.json();
      setResponseJson(json as R);
      setIsPending(false);
    },
    [endpoint, document, request]
  );

  // Related Opeartions are
  // [1] operations that have same path as base operation.
  // [2] action operations whose request payload key set doesn't contain one of base operation's response payload keys.
  const relatedOperationIds = useMemo<OperationId[]>(function () {
    const _relatedOperationIds: OperationId[] = [];
    const baseOperatioId = content.operationId;

    const baseRequest = getRequest(document, { operationId: baseOperatioId });
    if (!baseRequest) {
      return _relatedOperationIds;
    }

    const basePathItem = getPathItem(document, baseRequest.path);
    if (!basePathItem) {
      return _relatedOperationIds;
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
      _relatedOperationIds.push(operationId);
    });

    // Add operations under the rule of [2] described above.
    if (content.actions) {
      const baseOperationResponseKeys = (function (): string[] {
        const ret: string[] = [];
        if (!baseRequest.operation.responses) {
          return ret;
        }
        // TODO: defaultや他status codeも考慮すること。
        const response = baseRequest.operation.responses['200'];
        if (!response || !response.content) {
          return ret;
        }
        const mediaType = pickMediaType(response.content);
        if (!mediaType.schema) {
          return ret;
        }
        switch (content.type) {
          case 'table': {
            if (!mediaType.schema.properties) {
              return ret;
            }
            const listKey = document.info['x-table']?.responseListKey;
            if (!listKey) {
              return ret;
            }
            const properties = mediaType.schema.properties[listKey].properties;
            if (!properties) {
              return ret;
            }
            ret.push(..._.keys(properties));
            break;
          }
          case 'number':
          case 'custom':
            break;
          default:
            // TODO: どーする？
            throw new Error('TODO: 考慮忘れしてるよ');
        }
        return ret;
      })();
      content.actions.forEach(function (action) {
        const actionOperationRequestKeys = (function (): string[] {
          const ret: string[] = [];
          const request = getRequest(document, {
            operationId: action.operationId,
          });
          if (!request) {
            return ret;
          }
          if (!request.operation.parameters) {
            return ret;
          }
          ret.push(
            ...request.operation.parameters.map(function (parameter) {
              return parameter.name;
            })
          );
          return ret;
        })();

        if (
          _.intersection(baseOperationResponseKeys, actionOperationRequestKeys)
            .length === 0
        ) {
          _relatedOperationIds.push(action.operationId);
        }
      });
    }
    return _relatedOperationIds;
  }, []);

  return {
    isPending,
    error,
    response,
    responseJson,
    fetch,
    request,
    requestValue,
    setRequestValue,
    relatedOperationIds,
  };
};
