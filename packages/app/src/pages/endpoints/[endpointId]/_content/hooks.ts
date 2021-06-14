import _ from 'lodash';
import { Dispatch, SetStateAction, useState, useCallback } from 'react';
import { Endpoint } from '$types/index';
import {
  Document,
  Info,
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
  getRequest,
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

  return {
    isPending,
    error,
    response,
    responseJson,
    fetch,
    request,
    requestValue,
    setRequestValue,
  };
};
