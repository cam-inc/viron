import _ from 'lodash';
import { useCallback, useMemo, useRef } from 'react';
import {
  HTTP_STATUS,
  ENVIRONMENTAL_VARIABLE,
  OAUTH_REDIRECT_URI,
  OIDC_REDIRECT_URI,
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
  EndpointUndefinedError,
} from '~/errors';
import { useI18n } from '~/hooks/i18n';
import { remove, KEY, set } from '~/storage';
import {
  useEndpointListGlobalState,
  useEndpointListByGroupGlobalStateValue,
  useEndpointListUngroupedGlobalStateValue,
  useEndpointGroupListGlobalStateSet,
  useEndpointGroupListSortedGlobalStateValue,
  useEndpointGroupListGlobalState,
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
import {
  Document,
  Request,
  RequestValue,
  RequestParametersValue,
  RequestRequestBodyValue,
} from '~/types/oas';
import { promiseErrorHandler } from '~/utils';
import {
  lint,
  resolve,
  extractRequest,
  replaceWithEnvironmentalVariables,
  cleanupRequestValue,
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
} from '~/utils/oas';

export type UseEndpointReturn = {
  list: Endpoint[];
  setList: React.Dispatch<React.SetStateAction<Endpoint[]>>;
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
  prepareSigninOidc: (
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
  prepareSigninOidcCallback: (
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
  editEndpoint: (
    currentId: string,
    endpoint: Endpoint,
    options?: { resolveDuplication: boolean }
  ) =>
    | {
        error: BaseError;
      }
    | {
        error: null;
      };
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
  const { navigate: _navigate } = useI18n();
  const [endpointList, setEndpointList] = useEndpointListGlobalState();
  const setEndpointGroupList = useEndpointGroupListGlobalStateSet();
  const endpointListByGroup = useEndpointListByGroupGlobalStateValue();
  const endpointListUngrouped = useEndpointListUngroupedGlobalStateValue();
  const endpointGroupList = useEndpointGroupListSortedGlobalStateValue();

  const connect = useCallback<UseEndpointReturn['connect']>(async (url) => {
    const [response, responseError] = await promiseErrorHandler(
      globalThis.fetch(url, {
        mode: 'cors',
        credentials: 'include',
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
        globalThis.fetch(endpoint.url, {
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
          globalThis.fetch(
            `${new globalThis.URL(endpoint.url).origin}${authenticationPath}`,
            {
              mode: 'cors',
              credentials: 'include',
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
      const lintResult = lint(authentication.oas);
      if (lintResult.isFailure()) {
        return {
          error: lintResult.value,
        };
      }
      authentication.oas = resolve(authentication.oas);
      // TODO: validate more severely.
      if (!authentication.list) {
        return {
          error: new EndpointError(
            `GET ${authenticationPath} returns data not properly formatted.`
          ),
        };
      }

      let document: Document | null = null;
      if (response.ok) {
        const _document: unknown = await response.json();
        const lintResult = lint(_document);
        if (lintResult.isFailure()) {
          return {
            error: lintResult.value,
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

  const editEndpoint = useCallback<UseEndpointReturn['editEndpoint']>(
    (
      currentId,
      endpoint,
      { resolveDuplication } = { resolveDuplication: false }
    ) => {
      const index = endpointList.findIndex((item) => item.id === currentId);
      if (index === -1) {
        return {
          error: new EndpointUndefinedError(),
        };
      }

      if (
        endpointList.some(
          (item, idx) => item.id === endpoint.id && idx !== index
        )
      ) {
        if (resolveDuplication) {
          endpoint.id = `${endpoint.id}-${Math.random()}`;
        } else {
          return {
            error: new EndpointDuplicatedError(),
          };
        }
      }

      setEndpointList((currVal) => [
        ...currVal.slice(0, index),
        endpoint,
        ...currVal.slice(index + 1),
      ]);

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
    const getRequestResult = extractRequest(
      authentication.oas,
      authConfig.operationId
    );
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
        globalThis.fetch(requestInfo, requestInit)
      );
      if (!!responseError) {
        return {
          error: new NetworkError(responseError.message),
        };
      }
      if (!response.ok) {
        return {
          error: await getHTTPError(response),
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

  const prepareSigninOidc = useCallback<UseEndpointReturn['prepareSigninOidc']>(
    (endpoint, authentication, defaultValues = {}) => {
      const authConfig = authentication.list.find(
        (item) => item.type === 'oidc'
      );
      if (!authConfig) {
        return {
          error: new BaseError('AuthConfig for OIDC not found.'),
        };
      }
      const getRequestResult = extractRequest(
        authentication.oas,
        authConfig.operationId
      );
      if (getRequestResult.isFailure()) {
        return {
          error: new OASError('Request object not found.'),
        };
      }
      const request = getRequestResult.value;
      defaultValues = _.merge(
        {},
        {
          parameters: replaceWithEnvironmentalVariables<RequestParametersValue>(
            authConfig.defaultParametersValue || {},
            {
              [ENVIRONMENTAL_VARIABLE.OIDC_REDIRECT_URI]: OIDC_REDIRECT_URI,
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
          set(KEY.OIDC_ENDPOINT_ID, endpoint.id);
          globalThis.location.href = requestInfo.toString();
        } catch (e: unknown) {
          remove(KEY.OIDC_ENDPOINT_ID);
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
    },
    []
  );

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
    const getRequestResult = extractRequest(
      authentication.oas,
      authConfig.operationId
    );
    if (getRequestResult.isFailure()) {
      return {
        error: new OASError('Request object not found.'),
      };
    }
    const request = getRequestResult.value;
    defaultValues = _.merge(
      {},
      {
        parameters: replaceWithEnvironmentalVariables<RequestParametersValue>(
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
    const getRequestResult = extractRequest(
      authentication.oas,
      authConfig.operationId
    );
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
        requestBody: replaceWithEnvironmentalVariables<RequestRequestBodyValue>(
          authConfig.defaultRequestBodyValue || {},
          {
            [ENVIRONMENTAL_VARIABLE.OAUTH_REDIRECT_URI]: OAUTH_REDIRECT_URI,
          }
        ),
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
        globalThis.fetch(requestInfo, requestInit)
      );
      if (!!responseError) {
        return {
          error: new NetworkError(responseError.message),
        };
      }
      if (!response.ok) {
        return {
          error: await getHTTPError(response),
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

  const prepareSigninOidcCallback = useCallback<
    UseEndpointReturn['prepareSigninOidcCallback']
  >((endpoint, authentication, defaultValues = {}) => {
    const authConfig = authentication.list.find(
      (item) => item.type === 'oidccallback'
    );
    if (!authConfig) {
      return {
        error: new BaseError('AuthConfig for OIDC callback not found.'),
      };
    }
    const getRequestResult = extractRequest(
      authentication.oas,
      authConfig.operationId
    );
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
        requestBody: replaceWithEnvironmentalVariables<RequestRequestBodyValue>(
          authConfig.defaultRequestBodyValue || {},
          {
            [ENVIRONMENTAL_VARIABLE.OIDC_REDIRECT_URI]: OIDC_REDIRECT_URI,
          }
        ),
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
        globalThis.fetch(requestInfo, requestInit)
      );
      if (!!responseError) {
        return {
          error: new NetworkError(responseError.message),
        };
      }
      if (!response.ok) {
        return {
          error: await getHTTPError(response),
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
      const getRequestResult = extractRequest(
        authentication.oas,
        authConfig.operationId
      );
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
          globalThis.fetch(requestInfo, requestInit)
        );
        if (!!responseError) {
          return {
            error: new NetworkError(responseError.message),
          };
        }
        if (!response.ok) {
          return {
            error: await getHTTPError(response),
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
          const _item = { ...item };
          if (item.groupId === endpointGroupId) {
            delete _item.groupId;
          }
          return _item;
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
      setList: setEndpointList,
      connect,
      fetchDocument,
      navigate,
      prepareSigninEmail,
      prepareSigninOidc,
      prepareSigninOidcCallback,
      prepareSigninOAuth,
      prepareSigninOAuthCallback,
      prepareSignout,
      addEndpoint,
      editEndpoint,
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
      setEndpointList,
      connect,
      fetchDocument,
      navigate,
      prepareSigninEmail,
      prepareSigninOidc,
      prepareSigninOidcCallback,
      prepareSigninOAuth,
      prepareSigninOAuthCallback,
      prepareSignout,
      addEndpoint,
      editEndpoint,
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

export const useEndpointGroupToggle = (id: string) => {
  const [endpointGroups, setEndpointGroups] = useEndpointGroupListGlobalState();
  const endpointGroup = endpointGroups.find((group) => group.id === id);
  const isOpen = endpointGroup?.isOpen ?? false;

  const toggle = () => {
    setEndpointGroups((groups) => {
      return groups.map((group) => {
        return group.id === id ? { ...group, isOpen: !isOpen } : group;
      });
    });
  };

  return { isOpen, toggle };
};
