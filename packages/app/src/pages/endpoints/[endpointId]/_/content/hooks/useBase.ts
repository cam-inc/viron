import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { HTTPStatusCode } from '~/constants';
import { BaseError, getHTTPError, NetworkError } from '~/errors';
import { Endpoint } from '~/types';
import {
  Document,
  Content,
  CONTENT_TYPE,
  Request as RequestType,
  RequestValue,
  TableColumn,
} from '~/types/oas';
import { promiseErrorHandler } from '~/utils';
import {
  extractRequest,
  cleanupRequestValue,
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
  extractTableColumns,
} from '~/utils/oas';
import useAutoRefresh from './useAutoRefresh';

export type UseBaseReturn = {
  isPending: boolean;
  error: BaseError | null;
  data: any;
  request: RequestType;
  requestValue: RequestValue;
  fetch: (requestValue: RequestValue) => void;
  refresh: () => void;
  pagination: UsePaginationReturn;
  filter: UseFilterReturn;
};
const useBase = (
  endpoint: Endpoint,
  document: Document,
  content: Content
): UseBaseReturn => {
  const [isPending, setIsPending] = useState<UseBaseReturn['isPending']>(true);
  const [error, setError] = useState<UseBaseReturn['error']>(null);
  const [data, setData] = useState<UseBaseReturn['data']>(null);
  const request = useMemo<UseBaseReturn['request']>(() => {
    const getRequestResult = extractRequest(document, content.operationId);
    if (getRequestResult.isFailure()) {
      throw getRequestResult.value;
    }
    return getRequestResult.value;
  }, [document, content.operationId]);

  const [requestValue, setRequestValue] = useState<
    UseBaseReturn['requestValue']
  >(
    cleanupRequestValue(request, {
      parameters: content.defaultParametersValue,
      requestBody: content.defaultRequestBodyValue,
    })
  );

  const fetch = useCallback<UseBaseReturn['fetch']>((requestValue) => {
    // This is just a trigger to start fetching.
    setRequestValue(requestValue);
  }, []);
  const refresh = useCallback<UseBaseReturn['refresh']>(() => {
    // This is just a trigger to start fetching.
    setRequestValue((currVal) => ({
      ...currVal,
    }));
  }, []);

  // Request will be triggered when requet value changes.
  useEffect(() => {
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
      const data: unknown = await response.json();
      setData(data);
      setError(null);
      setIsPending(false);
    };
    f();
  }, [request, endpoint, document, requestValue]);

  // Auto Refresh.
  useAutoRefresh(content, refresh);

  // Pagination
  const pagination = usePagination(
    endpoint,
    document,
    content,
    data,
    requestValue,
    fetch
  );

  // filter
  const filter = useFilter(endpoint, document, content);

  const ret = useMemo<UseBaseReturn>(
    () => ({
      isPending,
      error,
      data,
      request,
      requestValue,
      fetch,
      refresh,
      pagination,
      filter,
    }),
    [
      isPending,
      error,
      data,
      request,
      requestValue,
      fetch,
      refresh,
      pagination,
      filter,
    ]
  );
  return ret;
};
export default useBase;

type UsePaginationReturn =
  | { enabled: false }
  | {
      enabled: true;
      currentPage: number;
      maxPage: number;
      change: (page: number) => void;
    };
const usePagination = (
  endpoint: Endpoint,
  document: Document,
  content: Content,
  data: UseBaseReturn['data'],
  requestValue: UseBaseReturn['requestValue'],
  fetch: UseBaseReturn['fetch']
): UsePaginationReturn => {
  const pagination = useMemo<UseBaseReturn['pagination']>(() => {
    if (!content.pagination) {
      return {
        enabled: false,
      };
    }
    if (!data) {
      return {
        enabled: false,
      };
    }
    switch (content.type) {
      case CONTENT_TYPE.NUMBER:
        return {
          enabled: false,
        };
      case CONTENT_TYPE.TABLE: {
        const responseListKey = document.info['x-table']?.responseListKey;
        if (!responseListKey) {
          return {
            enabled: false,
          };
        }
        const pager = document.info['x-table']?.pager;
        if (!pager) {
          return {
            enabled: false,
          };
        }
        const { requestPageKey, responseMaxpageKey, responsePageKey } = pager;
        const maxPage = data[responseMaxpageKey];
        const currentPage = data[responsePageKey];
        const change = (page: number) => {
          fetch({
            ...requestValue,
            parameters: {
              ...requestValue.parameters,
              [requestPageKey]: page,
            },
          });
        };
        return {
          enabled: true,
          currentPage,
          maxPage,
          change,
        };
      }
    }
  }, [document, content, data, requestValue, fetch]);

  return pagination;
};

type UseFilterReturn =
  | {
      enabled: false;
    }
  | {
      enabled: true;
      list: (Pick<TableColumn, 'name' | 'key'> & { isActive: boolean })[];
      listOmitted: TableColumn['key'][];
      filtered: boolean;
      activate: (key: TableColumn['key']) => void;
      inactivate: (key: TableColumn['key']) => void;
      toggle: (key: TableColumn['key']) => void;
    };
const useFilter = (
  endpoint: Endpoint,
  document: Document,
  content: Content
): UseFilterReturn => {
  const [omitted, setOmitted] = useState<TableColumn['key'][]>([]);

  const ret = useMemo<UseFilterReturn>(() => {
    if (content.type !== CONTENT_TYPE.TABLE) {
      return {
        enabled: false,
      };
    }
    const extractTableColumnsResult = extractTableColumns(document, content);
    if (extractTableColumnsResult.isFailure()) {
      return {
        enabled: false,
      };
    }
    const tableColumns = extractTableColumnsResult.value;

    const activate = (key: TableColumn['key']) => {
      setOmitted((currVal) => currVal.filter((v) => v !== key));
    };
    const inactivate = (key: TableColumn['key']) => {
      setOmitted((currVal) => [...currVal, key]);
    };
    const toggle = (key: TableColumn['key']) => {
      if (omitted.includes(key)) {
        activate(key);
      } else {
        inactivate(key);
      }
    };
    return {
      enabled: true,
      list: tableColumns.map((column) => ({
        ...column,
        isActive: !omitted.includes(column.key),
      })),
      listOmitted: omitted,
      filtered: !!omitted.length,
      activate,
      inactivate,
      toggle,
    };
  }, [endpoint, document, content, omitted]);
  return ret;
};
