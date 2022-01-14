import { useCallback, useEffect, useMemo, useState } from 'react';
import { HTTPStatusCode } from '~/constants';
import { BaseError, getHTTPError, NetworkError } from '~/errors';
import { Endpoint } from '~/types';
import {
  Document,
  Info,
  Request as RequestType,
  RequestValue,
} from '~/types/oas';
import { promiseErrorHandler } from '~/utils';
import {
  cleanupRequestValue,
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
  getRequest,
} from '~/utils/oas';
import useAutoRefresh from './useAutoRefresh';

export type UseBaseReturn = {
  isPending: boolean;
  error: BaseError | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any | null;
  request: RequestType;
  requestValue: RequestValue;
  fetch: (requestValue: RequestValue) => void;
  refresh: () => void;
};
const useBase = (
  endpoint: Endpoint,
  document: Document,
  content: Info['x-pages'][number]['contents'][number]
): UseBaseReturn => {
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<BaseError | null>(null);

  const request = useMemo<RequestType>(() => {
    const getRequestResult = getRequest(document, {
      operationId: content.operationId,
    });
    if (getRequestResult.isFailure()) {
      throw getRequestResult.value;
    }
    return getRequestResult.value;
  }, [document, content.operationId]);

  const [requestValue, setRequestValue] = useState<RequestValue>(
    request
      ? cleanupRequestValue(request, {
          parameters: content.defaultParametersValue,
          requestBody: content.defaultRequestBodyValue,
        })
      : {}
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any | null>(null);

  // Archieved combining useEffect below.
  const fetch = useCallback((requestValue: RequestValue) => {
    // This is just a trigger to start fetching.
    setRequestValue(requestValue);
  }, []);
  const refresh = useCallback(() => {
    // This is just a trigger to start fetching.
    setRequestValue((currVal) => ({
      ...currVal,
    }));
  }, []);

  // Request will be triggered when requet value changes.
  useEffect(() => {
    if (!request) {
      return;
    }
    const f = async () => {
      // Clear all.
      setIsPending(true);
      setError(null);
      setData(null);

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
        setError(new NetworkError());
        setData(null);
        setIsPending(false);
        return;
      }
      if (!response.ok) {
        // The authorization cookie is not valid or any other reasons.
        setError(getHTTPError(response.status as HTTPStatusCode));
        setData(null);
        setIsPending(false);
        return;
      }
      const data = await response.json();
      setData(data);
      setError(null);
      setIsPending(false);
    };
    f();
  }, [request, endpoint, document, requestValue]);

  // Auto Refresh.
  const autoRefresh = useAutoRefresh(content);
  useEffect(() => {
    let intervalId: ReturnType<typeof globalThis.setInterval>;
    const cleanup = () => {
      globalThis.clearInterval(intervalId);
    };
    if (autoRefresh.enabled) {
      intervalId = globalThis.setInterval(() => {
        refresh();
      }, autoRefresh.intervalSec);
    }
    return cleanup;
  }, [refresh, autoRefresh]);

  const ret = useMemo<UseBaseReturn>(
    () => ({
      isPending,
      error,
      data,
      request,
      requestValue,
      fetch,
      refresh,
    }),
    [isPending, error, data, request, requestValue, fetch, refresh]
  );
  return ret;
};
export default useBase;
