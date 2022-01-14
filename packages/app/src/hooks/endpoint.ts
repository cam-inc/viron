import { navigate as _navigate } from 'gatsby';
import _ from 'lodash';
import { useCallback, useMemo, useRef } from 'react';
import {
  HTTP_STATUS,
  HTTPStatusCode,
  ENVIRONMENTAL_VARIABLE,
  OAUTH_REDIRECT_URI,
} from '~/constants';
import {
  BaseError,
  NetworkError,
  HTTPUnexpectedError,
  FileReaderError,
  EndpointError,
  EndpointDuplicatedError,
  EndpointExportError,
  EndpointGroupError,
  EndpointGroupDuplicatedError,
  OASError,
  UnexpectedError,
  getHTTPError,
} from '~/errors';
import { remove, KEY, set } from '~/storage';
import {
  useEndpointListGlobalState,
  useEndpointListByGroupGlobalStateValue,
  useEndpointListUngroupedGlobalStateValue,
  useEndpointGroupListGlobalStateSet,
  useEndpointGroupListSortedGlobalStateValue,
} from '~/store';
import {
  Endpoint,
  EndpointID,
  EndpointGroup,
  EndpointGroupID,
  Distribution,
  Authentication,
  URL,
} from '~/types';
import { Document, Request, RequestValue } from '~/types/oas';
import { promiseErrorHandler } from '~/utils';
import {
  lint,
  resolve,
  getRequest,
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
  cleanupRequestValue,
  replaceEnvironmentalVariableOfDefaultRequestParametersValue,
} from '~/utils/oas';

export type UseEndpointReturn = {
  list: Endpoint[];
  listByGroup: {
    group: EndpointGroup;
    list: Endpoint[];
  }[];
  listUngrouped: Endpoint[];
  groupList: EndpointGroup[];
  connect: (url: URL) => Promise<
    | {
        error: BaseError;
      }
    | {
        error: null;
      }
  >;
  fetchDocument: (endpoint: Endpoint) => Promise<
    | {
        error: BaseError;
      }
    | {
        error: null;
        document: Document | null;
        authentication: Authentication;
      }
  >;
  navigate: (endpoint: Endpoint) => void;
  prepareSigninEmail: (
    endpoint: Endpoint,
    authentication: Authentication,
    defaultValues?: RequestValue
  ) =>
    | { error: BaseError }
    | {
        error: null;
        endpoint: Endpoint;
        document: Document;
        request: Request;
        defaultValues: RequestValue;
        execute: (
          requestValue: RequestValue
        ) => Promise<{ error: BaseError } | { error: null }>;
      };
  prepareSigninOAuth: (
    endpoint: Endpoint,
    authentication: Authentication,
    defaultValues?: RequestValue
  ) =>
    | { error: BaseError }
    | {
        error: null;
        endpoint: Endpoint;
        document: Document;
        request: Request;
        defaultValues: RequestValue;
        execute: (
          requestValue: RequestValue
        ) => Promise<{ error: BaseError } | { error: null }>;
      };
  prepareSigninOAuthCallback: (
    endpoint: Endpoint,
    authentication: Authentication,
    defaultValues?: RequestValue
  ) =>
    | {
        error: BaseError;
      }
    | {
        error: null;
        endpoint: Endpoint;
        document: Document;
        request: Request;
        defaultValues: RequestValue;
        execute: (requestValue: RequestValue) => Promise<
          | {
              error: BaseError;
            }
          | {
              error: null;
            }
        >;
      };
  prepareSignout: (
    endpoint: Endpoint,
    authentication: Authentication,
    defaultValues?: RequestValue
  ) =>
    | {
        error: BaseError;
      }
    | {
        error: null;
        endpoint: Endpoint;
        document: Document;
        request: Request;
        defaultValues: RequestValue;
        execute: (requestValue: RequestValue) => Promise<
          | {
              error: BaseError;
            }
          | {
              error: null;
            }
        >;
      };
  addEndpoint: (
    endpoint: Endpoint,
    options?: { resolveDuplication: boolean }
  ) => Promise<
    | {
        error: BaseError;
      }
    | {
        error: null;
      }
  >;
  removeEndpoint: (endpointId: EndpointID) => void;
  addGroup: (endpointGroup: EndpointGroup) => {
    error: EndpointGroupError | null;
  };
  removeGroup: (endpointGroupId: EndpointGroupID) => {
    error: EndpointGroupError | null;
  };
  ascendGroup: (endpointGroupId: EndpointGroupID) => {
    error: EndpointGroupError | null;
  };
  descendGroup: (endpointGroupId: EndpointGroupID) => {
    error: EndpointGroupError | null;
  };
  import: {
    execute: (
      cb: (
        result: { error: BaseError } | { error: null; data: Distribution }
      ) => void
    ) => void;
    bind: {
      className: 'hidden';
      type: 'file';
      accept: 'application/json';
      ref: React.MutableRefObject<HTMLInputElement | null>;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    };
  };
  export: () => { error: BaseError | null };
};
export const useEndpoint = (): UseEndpointReturn => {
  const [endpointList, setEndpointList] = useEndpointListGlobalState();
  const setEndpointGroupList = useEndpointGroupListGlobalStateSet();
  const endpointListByGroup = useEndpointListByGroupGlobalStateValue();
  const endpointListUngrouped = useEndpointListUngroupedGlobalStateValue();
  const endpointGroupList = useEndpointGroupListSortedGlobalStateValue();

  const connect = useCallback<UseEndpointReturn['connect']>(async (url) => {
    const [response, responseError] = await promiseErrorHandler(
      fetch(url, {
        mode: 'cors',
      })
    );
    // Could not establish a network connection to the endpoint.
    if (responseError) {
      return {
        error: new NetworkError(responseError.message),
      };
    }
    if (response.ok) {
      return {
        error: null,
      };
    }
    // The endpoint exists but authentication is required to get an OAS document.
    if (
      !response.ok &&
      (response.status === HTTP_STATUS.UNAUTHORIZED.code ||
        response.status === HTTP_STATUS.FORBIDDEN.code)
    ) {
      return {
        error: null,
      };
    }

    // Something enexpected happened.
    return {
      error: new UnexpectedError(),
    };
  }, []);

  const fetchDocument = useCallback<UseEndpointReturn['fetchDocument']>(
    async (endpoint) => {
      // Ping to see whether the authorization cookie is valid.
      const [response, responseError] = await promiseErrorHandler(
        fetch(endpoint.url, {
          mode: 'cors',
          credentials: 'include',
        })
      );
      if (responseError) {
        return {
          error: new NetworkError(responseError.message),
        };
      }

      if (
        !(
          response.ok ||
          response.status === HTTP_STATUS.UNAUTHORIZED.code ||
          response.status === HTTP_STATUS.FORBIDDEN.code
        )
      ) {
        return {
          error: new HTTPUnexpectedError(),
        };
      }

      // This is a pathname to which a request will be sent.
      const authenticationPath = response.headers.get('x-viron-authtypes-path');
      // Viron needs to know how to authenticate.
      if (!authenticationPath) {
        return {
          error: new EndpointError(
            'The x-viron-authtypes-path response header is missing.'
          ),
        };
      }
      const [authenticationResponse, authenticationResponseError] =
        await promiseErrorHandler(
          fetch(
            `${new globalThis.URL(endpoint.url).origin}${authenticationPath}`,
            {
              mode: 'cors',
            }
          )
        );
      if (authenticationResponseError) {
        return {
          error: new NetworkError(authenticationResponseError.message),
        };
      }
      const authentication: Authentication =
        await authenticationResponse.json();
      const { isValid, errors } = lint(authentication.oas);
      if (!isValid) {
        return {
          error: new OASError(
            errors?.[0].message ||
              'The OAS document is not of version we support.'
          ),
        };
      }
      authentication.oas = resolve(authentication.oas);
      // TODO: validate more severely.
      if (!authentication.list?.length) {
        return {
          error: new EndpointError(
            `GET ${authenticationPath} returns data not properly formatted.`
          ),
        };
      }

      let document: Document | null = null;
      if (response.ok) {
        const _document: unknown = await response.json();
        const { isValid, errors } = lint(_document);
        if (!isValid) {
          return {
            error: new OASError(
              errors?.[0].message ||
                'The OAS document is not of version we support.'
            ),
          };
        }
        document = resolve(_document as Record<string, unknown>);
      }

      return {
        error: null,
        document,
        authentication,
      };
    },
    []
  );

  const navigate = useCallback<UseEndpointReturn['navigate']>((endpoint) => {
    _navigate(`/endpoints/${endpoint.id}`);
  }, []);

  const addEndpoint = useCallback<UseEndpointReturn['addEndpoint']>(
    async (
      endpoint,
      { resolveDuplication } = { resolveDuplication: false }
    ) => {
      const _endpoint = { ...endpoint };
      // Duplication check.
      if (endpointList.find((item) => item.id === _endpoint.id)) {
        if (resolveDuplication) {
          // TODO: 精度を高めること。
          _endpoint.id = `${_endpoint.id}-${Math.random()}`;
        } else {
          return {
            error: new EndpointDuplicatedError(),
          };
        }
      }
      setEndpointList((currVal) => [...currVal, _endpoint]);
      return {
        error: null,
      };
    },
    [endpointList, setEndpointList]
  );

  const prepareSigninEmail = useCallback<
    UseEndpointReturn['prepareSigninEmail']
  >((endpoint, authentication, defaultValues = {}) => {
    const authConfig = authentication.list.find(
      (item) => item.type === 'email'
    );
    if (!authConfig) {
      return {
        error: new BaseError('AuthConfig for email not found.'),
      };
    }
    const getRequestResult = getRequest(authentication.oas, {
      operationId: authConfig.operationId,
    });
    if (getRequestResult.isFailure()) {
      return {
        error: new OASError('Request object not found.'),
      };
    }
    const request = getRequestResult.value;
    defaultValues = _.merge(
      {},
      {
        parameters: authConfig.defaultParametersValue,
        requestBody: authConfig.defaultRequestBodyValue,
      },
      cleanupRequestValue(request, defaultValues)
    );
    const execute = async (requestValue: RequestValue) => {
      const requestPayloads = constructRequestPayloads(
        request.operation,
        requestValue
      );
      const requestInfo = constructRequestInfo(
        endpoint,
        authentication.oas,
        request,
        requestPayloads
      );
      const requestInit = constructRequestInit(request, requestPayloads);
      const [response, responseError] = await promiseErrorHandler(
        fetch(requestInfo, requestInit)
      );
      if (!!responseError) {
        return {
          error: new NetworkError(responseError.message),
        };
      }
      if (!response.ok) {
        return {
          error: getHTTPError(response.status as HTTPStatusCode),
        };
      }
      return {
        error: null,
      };
    };
    return {
      error: null,
      endpoint,
      document: authentication.oas,
      request,
      defaultValues,
      execute,
    };
  }, []);

  const prepareSigninOAuth = useCallback<
    UseEndpointReturn['prepareSigninOAuth']
  >((endpoint, authentication, defaultValues = {}) => {
    const authConfig = authentication.list.find(
      (item) => item.type === 'oauth'
    );
    if (!authConfig) {
      return {
        error: new BaseError('AuthConfig for OAuth not found.'),
      };
    }
    const getRequestResult = getRequest(authentication.oas, {
      operationId: authConfig.operationId,
    });
    if (getRequestResult.isFailure()) {
      return {
        error: new OASError('Request object not found.'),
      };
    }
    const request = getRequestResult.value;
    defaultValues = _.merge(
      {},
      {
        parameters: replaceEnvironmentalVariableOfDefaultRequestParametersValue(
          authConfig.defaultParametersValue || {},
          {
            [ENVIRONMENTAL_VARIABLE.OAUTH_REDIRECT_URI]: OAUTH_REDIRECT_URI,
          }
        ),
        requestBody: authConfig.defaultRequestBodyValue,
      },
      cleanupRequestValue(request, defaultValues)
    );
    const execute = async (requestValue: RequestValue) => {
      const requestPayloads = constructRequestPayloads(
        request.operation,
        requestValue
      );
      const requestInfo = constructRequestInfo(
        endpoint,
        authentication.oas,
        request,
        requestPayloads
      );
      try {
        set(KEY.OAUTH_ENDPOINT_ID, endpoint.id);
        globalThis.location.href = requestInfo.toString();
      } catch (e: unknown) {
        remove(KEY.OAUTH_ENDPOINT_ID);
        let message = '';
        if (e instanceof Error) {
          message = e.message;
        }
        return {
          error: new BaseError(message),
        };
      }
      return {
        error: null,
      };
    };
    return {
      error: null,
      endpoint,
      document: authentication.oas,
      request,
      defaultValues,
      execute,
    };
  }, []);

  const prepareSigninOAuthCallback = useCallback<
    UseEndpointReturn['prepareSigninOAuthCallback']
  >((endpoint, authentication, defaultValues = {}) => {
    const authConfig = authentication.list.find(
      (item) => item.type === 'oauthcallback'
    );
    if (!authConfig) {
      return {
        error: new BaseError('AuthConfig for OAuth callback not found.'),
      };
    }
    const getRequestResult = getRequest(authentication.oas, {
      operationId: authConfig.operationId,
    });
    if (getRequestResult.isFailure()) {
      return {
        error: new OASError('Request object not found.'),
      };
    }
    const request = getRequestResult.value;
    defaultValues = _.merge(
      {},
      {
        parameters: authConfig.defaultParametersValue,
        requestBody: authConfig.defaultRequestBodyValue,
      },
      cleanupRequestValue(request, defaultValues)
    );
    const execute = async (requestValue: RequestValue) => {
      const requestPayloads = constructRequestPayloads(
        request.operation,
        requestValue
      );
      const requestInfo = constructRequestInfo(
        endpoint,
        authentication.oas,
        request,
        requestPayloads
      );
      const requestInit = constructRequestInit(request, requestPayloads);
      const [response, responseError] = await promiseErrorHandler(
        fetch(requestInfo, requestInit)
      );
      if (!!responseError) {
        return {
          error: new NetworkError(responseError.message),
        };
      }
      if (!response.ok) {
        return {
          error: getHTTPError(response.status as HTTPStatusCode),
        };
      }
      return {
        error: null,
      };
    };
    return {
      error: null,
      endpoint,
      document: authentication.oas,
      request,
      defaultValues,
      execute,
    };
  }, []);

  const prepareSignout = useCallback<UseEndpointReturn['prepareSignout']>(
    (endpoint, authentication, defaultValues = {}) => {
      const authConfig = authentication.list.find(
        (item) => item.type === 'signout'
      );
      if (!authConfig) {
        return {
          error: new BaseError('AuthConfig for signout not found.'),
        };
      }
      const getRequestResult = getRequest(authentication.oas, {
        operationId: authConfig.operationId,
      });
      if (getRequestResult.isFailure()) {
        return {
          error: new OASError('Request object not found.'),
        };
      }
      const request = getRequestResult.value;
      defaultValues = _.merge(
        {},
        {
          parameters: authConfig.defaultParametersValue,
          requestBody: authConfig.defaultRequestBodyValue,
        },
        cleanupRequestValue(request, defaultValues)
      );
      const execute = async (requestValue: RequestValue) => {
        const requestPayloads = constructRequestPayloads(
          request.operation,
          requestValue
        );
        const requestInfo = constructRequestInfo(
          endpoint,
          authentication.oas,
          request,
          requestPayloads
        );
        const requestInit = constructRequestInit(request, requestPayloads);
        const [response, responseError] = await promiseErrorHandler(
          fetch(requestInfo, requestInit)
        );
        if (!!responseError) {
          return {
            error: new NetworkError(responseError.message),
          };
        }
        if (!response.ok) {
          return {
            error: getHTTPError(response.status as HTTPStatusCode),
          };
        }
        return {
          error: null,
        };
      };
      return {
        error: null,
        endpoint,
        document: authentication.oas,
        request,
        defaultValues,
        execute,
      };
    },
    []
  );

  const removeEndpoint = useCallback<UseEndpointReturn['removeEndpoint']>(
    (endpointId) => {
      setEndpointList((currVal) =>
        currVal.filter((item) => item.id !== endpointId)
      );
    },
    [setEndpointList]
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

  const removeGroup = useCallback<UseEndpointReturn['removeGroup']>(
    (endpointGroupId) => {
      // Remove group definition.
      setEndpointGroupList((currVal) =>
        currVal.filter((item) => item.id !== endpointGroupId)
      );
      // Remove groupId for each endpoint items.
      setEndpointList((currVal) =>
        currVal.map((item) => {
          if (item.groupId === endpointGroupId) {
            delete item.groupId;
          }
          return item;
        })
      );
      return {
        error: null,
      };
    },
    [setEndpointGroupList, setEndpointList]
  );

  // TODO: 処理を綺麗に。
  const ascendGroup = useCallback<UseEndpointReturn['ascendGroup']>(
    (endpointGroupId) => {
      setEndpointGroupList((currVal) => {
        const ret = [...currVal]
          .sort((a, b) => {
            return (b.priority || 0) - (a.priority || 0);
          })
          .map((item, idx) => ({
            ...item,
            priority: currVal.length - idx - 1,
          }));
        const target = ret.find((item) => item.id === endpointGroupId);
        if (!target) {
          return ret;
        }
        return ret.map((item) => {
          if (item.id === target.id) {
            return {
              ...item,
              priority: item.priority + 1,
            };
          } else if (item.priority === target.priority + 1) {
            return {
              ...item,
              priority: item.priority - 1,
            };
          }
          return item;
        });
      });
      return {
        error: null,
      };
    },
    [setEndpointGroupList]
  );

  // TODO: 処理を綺麗に。
  const descendGroup = useCallback<UseEndpointReturn['descendGroup']>(
    (endpointGroupId) => {
      setEndpointGroupList((currVal) => {
        const ret = [...currVal]
          .sort((a, b) => {
            return (b.priority || 0) - (a.priority || 0);
          })
          .map((item, idx) => ({
            ...item,
            priority: currVal.length - idx - 1,
          }));
        const target = ret.find((item) => item.id === endpointGroupId);
        if (!target) {
          return ret;
        }
        return ret.map((item) => {
          if (item.id === target.id) {
            return {
              ...item,
              priority: item.priority - 1,
            };
          } else if (item.priority === target.priority - 1) {
            return {
              ...item,
              priority: item.priority + 1,
            };
          }
          return item;
        });
      });
      return {
        error: null,
      };
    },
    [setEndpointGroupList]
  );

  const importInputElmRef: UseEndpointReturn['import']['bind']['ref'] =
    useRef(null);
  const _import = useMemo<UseEndpointReturn['import']>(() => {
    let cb: Parameters<UseEndpointReturn['import']['execute']>[0] = () => {
      // to be overwritten.
    };
    const execute: UseEndpointReturn['import']['execute'] = (_cb) => {
      cb = _cb;
      importInputElmRef.current?.click();
    };
    const handleChange: UseEndpointReturn['import']['bind']['onChange'] = (
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
          cb({
            error: new FileReaderError('Invalid file type.'),
          });
          cleanup();
          return;
        }
        let distribution: Distribution;
        try {
          distribution = JSON.parse(reader.result);
        } catch {
          cb({
            error: new FileReaderError('Invalid file data.'),
          });
          cleanup();
          return;
        }
        cb({
          error: null,
          data: distribution,
        });
        cleanup();
        return;
      };
      reader.onerror = () => {
        cb({
          error: new FileReaderError(reader.error?.message),
        });
        cleanup();
      };
    };
    return {
      execute,
      bind: {
        className: 'hidden',
        type: 'file',
        accept: 'application/json',
        ref: importInputElmRef,
        onChange: handleChange,
      },
    };
  }, []);

  const _export = useCallback<UseEndpointReturn['export']>(() => {
    try {
      const data: Distribution = {
        endpointList,
        endpointGroupList,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const blobURL = globalThis.URL.createObjectURL(blob);
      const anchorElement = document.createElement('a');
      anchorElement.setAttribute('download', 'endpoints.json');
      anchorElement.href = blobURL;
      anchorElement.style.display = 'none';
      document.body.appendChild(anchorElement);
      anchorElement.click();
      // clean up.
      document.body.removeChild(anchorElement);
      globalThis.URL.revokeObjectURL(blobURL);
      return {
        error: null,
      };
    } catch (e: unknown) {
      let message = '';
      if (e instanceof Error) {
        message = e.message;
      }
      return {
        error: new EndpointExportError(message),
      };
    }
  }, [endpointList, endpointGroupList]);

  // To prevent this hook from returning a new object instance every time it is used.
  const ret = useMemo<UseEndpointReturn>(
    () => ({
      list: endpointList,
      listByGroup: endpointListByGroup,
      listUngrouped: endpointListUngrouped,
      groupList: endpointGroupList,
      connect,
      fetchDocument,
      navigate,
      prepareSigninEmail,
      prepareSigninOAuth,
      prepareSigninOAuthCallback,
      prepareSignout,
      addEndpoint,
      removeEndpoint,
      addGroup,
      removeGroup,
      ascendGroup,
      descendGroup,
      import: _import,
      export: _export,
    }),
    [
      endpointList,
      endpointListByGroup,
      endpointListUngrouped,
      endpointGroupList,
      connect,
      fetchDocument,
      navigate,
      prepareSigninEmail,
      prepareSigninOAuth,
      prepareSigninOAuthCallback,
      prepareSignout,
      addEndpoint,
      removeEndpoint,
      addGroup,
      removeGroup,
      ascendGroup,
      descendGroup,
      _import,
      _export,
    ]
  );
  return ret;
};
