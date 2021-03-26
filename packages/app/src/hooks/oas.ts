import { useState, useCallback } from 'react';
import { Endpoint, Token } from '$types/index';
import { Document, OperationId, Request } from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import { getRequestObject, getURLToTargetHost } from '$utils/oas';

export const useFetch = function <R>(
  endpoint: Endpoint,
  document: Document,
  { operationId }: { operationId?: OperationId }
): {
  isPending: boolean;
  error: Error | null;
  response: Response | null;
  responseJson: R | null;
  fetch: () => Promise<void>;
  requestObject: Request | null;
} {
  const requestObject = useRequestObject(document, { operationId });
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(
    !!requestObject ? null : new Error('request object not found.')
  );
  const [response, setResponse] = useState<Response | null>(null);
  const [responseJson, setResponseJson] = useState<R | null>(null);

  const fetch = useCallback(
    async function () {
      if (!requestObject) {
        return;
      }
      setIsPending(true);
      setResponse(null);
      setResponseJson(null);
      setError(null);

      const [response, responseError] = await promiseErrorHandler<Response>(
        window.fetch(
          `${getURLToTargetHost(endpoint, document)}/${requestObject.path}`,
          {
            method: requestObject.method,
            mode: 'cors',
            headers: {
              Authorization: endpoint.token as Token,
            },
          }
        )
      );

      if (!!responseError) {
        // Network error occured.
        setError(responseError);
        setIsPending(false);
        return;
      }
      if (!response.ok) {
        // The token is not valid or any other reasons.
        setError(new Error(`${response.status}: ${response.statusText}`));
        setIsPending(false);
        return;
      }
      setResponse(response);
      const json = await response.json();
      setResponseJson(json as R);
      setIsPending(false);
    },
    [endpoint, document, requestObject]
  );

  return {
    isPending,
    error,
    response,
    responseJson,
    fetch,
    requestObject,
  };
};

export const useRequestObject = function (
  document: Document,
  { operationId }: { operationId?: OperationId }
): Request | null {
  const requestObject = getRequestObject(document, { operationId });
  if (!requestObject) {
    return null;
  }
  return requestObject;
};
