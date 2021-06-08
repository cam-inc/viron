import _ from 'lodash';
import { useState, useCallback } from 'react';
import { Endpoint } from '$types/index';
import {
  Document,
  OperationId,
  Request,
  RequestPayloadParameter,
  RequestPayloadRequestBody,
} from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import {
  constructRequestInfo,
  constructRequestInit,
  getRequest,
} from '$utils/oas';

export const useFetch = function <R>(
  endpoint: Endpoint,
  document: Document,
  { operationId }: { operationId: OperationId }
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
} {
  const request = getRequest(document, { operationId });
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(
    !!request ? null : new Error('request object not found.')
  );
  const [response, setResponse] = useState<Response | null>(null);
  const [responseJson, setResponseJson] = useState<R | null>(null);

  const fetch = useCallback(
    async function ({
      requestPayloadParameters,
      requestPayloadRequestBody,
    }: {
      requestPayloadParameters?: RequestPayloadParameter[];
      requestPayloadRequestBody?: RequestPayloadRequestBody;
    } = {}) {
      if (!request) {
        return;
      }
      setIsPending(true);
      setResponse(null);
      setResponseJson(null);
      setError(null);

      const requestInfo: RequestInfo = constructRequestInfo(
        endpoint,
        document,
        request,
        requestPayloadParameters
      );
      const requestInit: RequestInit = constructRequestInit(
        request,
        requestPayloadParameters,
        requestPayloadRequestBody
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
  };
};
