import { useCallback, useEffect, useState } from 'react';
import { Endpoint } from '$types/index';
import {
  Document,
  Info,
  Request as RequestType,
  RequestValue,
} from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import {
  cleanupRequestValue,
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
  getRequest,
} from '$utils/oas';
import useAutoRefresh from './useAutoRefresh';
import { Props as ContentProps } from '../index';

export type UseBaseReturn = {
  isPending: boolean;
  error: Error | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any | null;
  request: RequestType;
  requestValue: RequestValue;
  fetch: (requestValue: RequestValue) => void;
  refresh: () => void;
};
const useBase = function (
  endpoint: Endpoint,
  document: Document,
  contentId: ContentProps['contentId'],
  content: Info['x-pages'][number]['contents'][number]
): UseBaseReturn {
  const request = getRequest(document, { operationId: content.operationId });
  // TODO: linter時にこういう例外を全てケアすべきかな。いちいちnullチェックしたくない。
  if (!request) {
    throw new Error('request object not found.');
  }

  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [requestValue, setRequestValue] = useState<RequestValue>(
    cleanupRequestValue(request, {
      parameters: content.defaultParametersValue,
      requestBody: content.defaultRequestBodyValue,
    })
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any | null>(null);

  // Achieved combining useEffect below.
  const fetch = useCallback(function (requestValue: RequestValue) {
    // This is just a trigger to start fetching.
    setRequestValue(requestValue);
  }, []);
  const refresh = useCallback(function () {
    // This is just a trigger to start fetching.
    setRequestValue(function (currVal) {
      return {
        ...currVal,
      };
    });
  }, []);

  // Request will be triggered when requet value changes.
  useEffect(
    function () {
      const f = async function () {
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
          window.fetch(requestInfo, requestInit)
        );
        if (responseError) {
          setError(responseError);
          setData(null);
          setIsPending(false);
          return;
        }
        if (!response.ok) {
          // The authorization cookie is not valid or any other reasons.
          setError(new Error(`${response.status}: ${response.statusText}`));
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
    },
    [request, endpoint, document, requestValue, contentId]
  );

  // Auto Refresh.
  const autoRefresh = useAutoRefresh(content);
  useEffect(
    function () {
      let intervalId: number;
      const cleanup = function () {
        window.clearInterval(intervalId);
      };
      if (autoRefresh.enabled) {
        intervalId = window.setInterval(function () {
          refresh();
        }, autoRefresh.intervalSec);
      }
      return cleanup;
    },
    [refresh, autoRefresh.enabled, autoRefresh.intervalSec]
  );

  return {
    isPending,
    error,
    data,
    request,
    requestValue,
    fetch,
    refresh,
  };
};
export default useBase;
