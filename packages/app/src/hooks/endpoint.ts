import { useCallback, useMemo, useRef, useState } from 'react';
import { HTTP_STATUS } from '~/constants';
import {
  BaseError,
  NetworkError,
  FileReaderError,
  EndpointError,
  EndpointDuplicatedError,
  EndpointExportError,
  EndpointGroupError,
  EndpointGroupDuplicatedError,
  OASError,
  UnexpectedError,
} from '~/errors';
import {
  useEndpointListGlobalState,
  useEndpointGroupListGlobalState,
} from '~/store';
import {
  Endpoint,
  EndpointGroup,
  Distribution,
  AuthConfigsResponse,
  URL,
} from '~/types';
import { promiseErrorHandler } from '~/utils';
import { lint, resolve } from '~/utils/oas';

export type UseEndpointReturn = {
  connect: (url: URL) => Promise<
    | {
        error: BaseError;
      }
    | {
        error: null;
        endpoint: Omit<Endpoint, 'id'>;
      }
  >;
  addEndpoint: (data: Pick<Endpoint, 'id' | 'url'>) => Promise<
    | {
        error: BaseError;
      }
    | {
        error: null;
        endpoint: Endpoint;
      }
  >;
  addGroup: (endpointGroup: EndpointGroup) => {
    error: EndpointGroupError | null;
  };
  import: {
    data?: Distribution;
    error?: BaseError;
    execute: () => void;
    bind: {
      className: 'hidden';
      type: 'file';
      accept: 'application/json';
      ref: React.MutableRefObject<HTMLInputElement | null>;
      handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    };
  };
  export: () => { error: BaseError | null };
};
export const useEndpoint = (): UseEndpointReturn => {
  const [endpointList, setEndpointList] = useEndpointListGlobalState();
  const [endpointGroupList, setEndpointGroupList] =
    useEndpointGroupListGlobalState();

  const connect = useCallback<UseEndpointReturn['connect']>(async (url) => {
    const [response, responseError] = await promiseErrorHandler(
      fetch(url, { mode: 'cors' })
    );
    // Could not establish a network connection to the endpoint.
    if (responseError) {
      return {
        error: new NetworkError(responseError.message),
      };
    }
    // The endpoint exists and its OAS document is open to public.
    if (response.ok) {
      const document: unknown = await response.json();
      const { isValid, errors } = lint(document);
      if (isValid) {
        return {
          error: null,
          endpoint: {
            url,
            isPrivate: true,
            document: resolve(document as Record<string, unknown>),
          },
        };
      } else {
        return {
          error: new OASError(
            errors?.[0].message ||
              'The OAS document is not of version we support.'
          ),
        };
      }
    }
    // The endpoint exists but authentication is required to get an OAS document.
    if (!response.ok && response.status === HTTP_STATUS.UNAUTHORIZED.code) {
      // This is a pathname to which a request will be sent.
      const authConfigsPath = response.headers.get('x-viron-authtypes-path');
      // Viron needs to know how to authenticate.
      if (!authConfigsPath) {
        return {
          error: new EndpointError(
            'The x-viron-authtypes-path response header is missing.'
          ),
        };
      }
      const [authConfigsResponse, authConfigsResponseError] =
        await promiseErrorHandler(
          fetch(`${new globalThis.URL(url).origin}${authConfigsPath}`, {
            mode: 'cors',
          })
        );
      if (authConfigsResponseError) {
        return {
          error: new NetworkError(authConfigsResponseError.message),
        };
      }
      const authConfigs: AuthConfigsResponse = await authConfigsResponse.json();
      // TODO: validate more severely.
      if (!authConfigs.oas || !authConfigs.list?.length) {
        return {
          error: new EndpointError(
            `GET ${authConfigsPath} returns data not properly formatted.`
          ),
        };
      }
      return {
        error: null,
        endpoint: {
          url,
          isPrivate: true,
          authConfigs,
        },
      };
    }
    // Something enexpected happened.
    return {
      error: new UnexpectedError(),
    };
  }, []);

  const addEndpoint = useCallback<UseEndpointReturn['addEndpoint']>(
    async (data) => {
      const connection = await connect(data.url);
      if (connection.error) {
        return {
          error: connection.error,
        };
      }
      // Duplication check.
      if (endpointList.find((item) => item.id === data.id)) {
        return {
          error: new EndpointDuplicatedError(),
        };
      }
      const endpoint: Endpoint = {
        id: data.id,
        ...connection.endpoint,
      };
      setEndpointList((currVal) => [...currVal, endpoint]);
      return {
        error: null,
        endpoint,
      };
    },
    [connect, endpointList, setEndpointList]
  );

  const addGroup = useCallback<UseEndpointReturn['addGroup']>(
    (endpointGroup) => {
      // Duplication check.
      if (endpointGroupList.find((item) => item.id === endpointGroup.id)) {
        return {
          error: new EndpointGroupDuplicatedError(),
        };
      }
      setEndpointGroupList((currVal) => [...currVal, endpointGroup]);
      return {
        error: null,
      };
    },
    [endpointGroupList, setEndpointGroupList]
  );

  const importInputElmRef: UseEndpointReturn['import']['bind']['ref'] =
    useRef(null);
  const [importData, setImportData] =
    useState<UseEndpointReturn['import']['data']>();
  const [importError, setImportError] =
    useState<UseEndpointReturn['import']['error']>();
  const _import = useMemo<UseEndpointReturn['import']>(() => {
    const execute = () => {
      importInputElmRef.current?.click();
    };
    const handleChange: UseEndpointReturn['import']['bind']['handleChange'] = (
      e
    ) => {
      const inputElement = e.currentTarget;
      if (!inputElement.files?.length) {
        return;
      }
      const [file] = inputElement.files;
      const cleanup = () => {
        // reset input element for further file selection.
        inputElement.value = '';
      };
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        if (typeof reader.result !== 'string') {
          setImportError(new FileReaderError('Invalid file type.'));
          cleanup();
          return;
        }
        let distribution: Distribution;
        try {
          distribution = JSON.parse(reader.result);
        } catch {
          setImportError(new FileReaderError('Invalid file data.'));
          cleanup();
          return;
        }
        setImportData(distribution);
        cleanup();
        return;
      };
      reader.onerror = () => {
        setImportError(new FileReaderError(reader.error?.message));
        cleanup();
      };
    };
    return {
      data: importData,
      error: importError,
      execute,
      bind: {
        className: 'hidden',
        type: 'file',
        accept: 'application/json',
        ref: importInputElmRef,
        handleChange,
      },
    };
  }, [importData, importError]);

  const _export = useCallback<UseEndpointReturn['export']>(() => {
    try {
      // Omit some data to minimize the json file size.
      const data: Distribution = {
        endpointList: endpointList.map((endpoint) => ({
          id: endpoint.id,
          url: endpoint.url,
        })),
        endpointGroupList,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const blobURL = URL.createObjectURL(blob);
      const anchorElement = document.createElement('a');
      anchorElement.setAttribute('download', 'endpoints.json');
      anchorElement.href = blobURL;
      anchorElement.style.display = 'none';
      document.body.appendChild(anchorElement);
      anchorElement.click();
      // clean up.
      document.body.removeChild(anchorElement);
      URL.revokeObjectURL(blobURL);
      return {
        error: null,
      };
    } catch {
      return {
        error: new EndpointExportError(),
      };
    }
  }, [endpointList, endpointGroupList]);

  // To prevent this hook from returning a new object instance every time it is used.
  const ret = useMemo<UseEndpointReturn>(
    () => ({
      connect,
      addEndpoint,
      addGroup,
      import: _import,
      export: _export,
    }),
    [connect, addGroup, addEndpoint, _import, _export]
  );
  return ret;
};
