import { IconType } from '@react-icons/all-files';
import { AiFillApi } from '@react-icons/all-files/ai/AiFillApi';
import { AiFillGoogleCircle } from '@react-icons/all-files/ai/AiFillGoogleCircle';
import { AiOutlineLogin } from '@react-icons/all-files/ai/AiOutlineLogin';
import { navigate } from 'gatsby';
import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import Button from '$components/button';
import Error from '$components/error';
import Drawer, { useDrawer } from '$components/drawer';
import Modal, { useModal } from '$components/modal';
import Request, { Props as RequestProps } from '$components/request';
import {
  ENVIRONMENTAL_VARIABLE,
  OAUTH_REDIRECT_URI,
  ON,
  HTTPStatusCode,
} from '$constants/index';
import { BaseError, getHTTPError, NetworkError } from '$errors/index';
import { remove, KEY, set } from '$storage/index';
import { AuthConfig, Endpoint } from '$types/index';
import {
  Request as RequestType,
  RequestParametersValue,
  RequestValue,
} from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import {
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
  getRequest,
  replaceEnvironmentalVariableOfDefaultRequestParametersValue,
  resolve,
} from '$utils/oas/index';

type Props = {
  endpoint: Endpoint;
  isSigninRequired: boolean;
};
const Signin: React.FC<Props> = ({ endpoint, isSigninRequired }) => {
  const authconfigOAuth = useMemo<AuthConfig | null>(
    function () {
      const _authconfig = _.find(endpoint.authConfigs?.list, function (item) {
        return item.type === 'oauth';
      });
      return _authconfig || null;
    },
    [endpoint]
  );

  const authconfigEmail = useMemo<AuthConfig | null>(
    function () {
      const _authconfig = _.find(endpoint.authConfigs?.list, function (item) {
        return item.type === 'email';
      });
      return _authconfig || null;
    },
    [endpoint]
  );

  const drawerOAuth = useDrawer();
  const handleOAuthClick = useCallback(
    function () {
      drawerOAuth.open();
    },
    [drawerOAuth]
  );

  const drawerEmail = useDrawer();
  const handleEmailClick = useCallback(
    function () {
      drawerEmail.open();
    },
    [drawerEmail]
  );

  const elm = useMemo<JSX.Element>(
    function () {
      return (
        <>
          <div className="flex items-center gap-2">
            {authconfigOAuth && (
              <Button
                on="surface"
                Icon={AiFillApi}
                label="Signin(OAuth)"
                size="xs"
                onClick={handleOAuthClick}
              />
            )}
            {authconfigEmail && (
              <Button
                on="surface"
                Icon={AiFillApi}
                label="Signin(Email)"
                size="xs"
                onClick={handleEmailClick}
              />
            )}
          </div>
          <Drawer {...drawerOAuth.bind}>
            {authconfigOAuth && (
              <OAuth endpoint={endpoint} authConfig={authconfigOAuth} />
            )}
          </Drawer>
          <Drawer {...drawerEmail.bind}>
            {authconfigEmail && (
              <Email endpoint={endpoint} authConfig={authconfigEmail} />
            )}
          </Drawer>
        </>
      );
    },
    [
      endpoint,
      authconfigOAuth,
      authconfigEmail,
      handleOAuthClick,
      handleEmailClick,
      drawerOAuth,
      drawerEmail,
    ]
  );

  if (!endpoint.isPrivate) {
    return null;
  }

  if (!isSigninRequired) {
    return null;
  }

  if (!authconfigOAuth && !authconfigEmail) {
    return null;
  }

  return elm;
};
export default Signin;

const OAuth: React.FC<{
  endpoint: Endpoint;
  authConfig: AuthConfig;
}> = ({ endpoint, authConfig }) => {
  let document = endpoint.authConfigs?.oas;
  if (document) {
    document = resolve(document);
  }
  const request = useMemo<RequestType | null>(
    function () {
      if (!document) {
        return null;
      }
      const getRequestResult = getRequest(document, {
        operationId: authConfig.operationId,
      });
      if (getRequestResult.isFailure()) {
        return null;
      }
      return getRequestResult.value;
    },
    [document, authConfig]
  );

  let Icon: IconType = AiOutlineLogin;
  if (authConfig.provider === 'google') {
    Icon = AiFillGoogleCircle;
  }

  const handleSubmit = useCallback(
    async function (requestValue: RequestValue) {
      if (!document) {
        return;
      }
      if (!request) {
        return;
      }
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
      try {
        set(KEY.OAUTH_ENDPOINT_ID, endpoint.id);
        location.href = requestInfo.toString();
      } catch {
        remove(KEY.OAUTH_ENDPOINT_ID);
      }
    },
    [endpoint, document, request]
  );

  const defaultValues = useMemo<RequestValue>(
    function () {
      return {
        parameters: replaceEnvironmentalVariableOfDefaultRequestParametersValue(
          authConfig.defaultParametersValue as RequestParametersValue,
          {
            [ENVIRONMENTAL_VARIABLE.OAUTH_REDIRECT_URI]: OAUTH_REDIRECT_URI,
          }
        ),
        requestBody: authConfig.defaultRequestBodyValue,
      };
    },
    [authConfig]
  );

  const renderHead = useCallback<NonNullable<RequestProps['renderHead']>>(
    function () {
      return (
        <div className="flex items-center text-on-surface">
          <Icon className="mr-1" />
          <div className="text-xs">OAuth</div>
        </div>
      );
    },
    [Icon]
  );

  if (!document) {
    return (
      <Error on={ON.SURFACE} error={new BaseError('OAS document missing.')} />
    );
  }

  if (!request) {
    return (
      <Error on={ON.SURFACE} error={new BaseError('Request object missing.')} />
    );
  }

  return (
    <Request
      on={ON.SURFACE}
      endpoint={endpoint}
      document={document}
      defaultValues={defaultValues}
      request={request}
      onSubmit={handleSubmit}
      className="h-full"
      renderHead={renderHead}
    />
  );
};

const Email: React.FC<{
  endpoint: Endpoint;
  authConfig: AuthConfig;
}> = ({ endpoint, authConfig }) => {
  let document = endpoint.authConfigs?.oas;
  if (document) {
    document = resolve(document);
  }

  // Request and Response error handling.
  const [error, setError] = useState<BaseError | null>(null);
  const errorModal = useModal();

  const request = useMemo<RequestType | null>(
    function () {
      if (!document) {
        return null;
      }
      const getRequestResult = getRequest(document, {
        operationId: authConfig.operationId,
      });
      if (getRequestResult.isFailure()) {
        return null;
      }
      return getRequestResult.value;
    },
    [document, authConfig]
  );

  const handleSubmit = useCallback(
    async function (requestValue: RequestValue) {
      if (!document) {
        return;
      }
      if (!request) {
        return;
      }
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

      const [response, responseError] = await promiseErrorHandler(
        fetch(requestInfo, requestInit)
      );
      if (!!responseError) {
        setError(new NetworkError(responseError.message));
        errorModal.open();
        return;
      }
      if (!response.ok) {
        setError(getHTTPError(response.status as HTTPStatusCode));
        errorModal.open();
        return;
      }
      navigate(`/endpoints/${endpoint.id}`);
    },
    [endpoint, document, request, errorModal]
  );

  const defaultValues = useMemo<RequestValue>(
    function () {
      return {
        parameters: authConfig.defaultParametersValue,
        requestBody: authConfig.defaultRequestBodyValue,
      };
    },
    [authConfig]
  );

  const renderHead = useCallback<NonNullable<RequestProps['renderHead']>>(
    function () {
      return (
        <div className="flex items-center text-on-surface">
          <AiOutlineLogin className="mr-1" />
          <div className="text-xs">Email</div>
        </div>
      );
    },
    []
  );

  if (!document) {
    return (
      <Error on={ON.SURFACE} error={new BaseError('OAS document missing.')} />
    );
  }

  if (!request) {
    return (
      <Error on={ON.SURFACE} error={new BaseError('Request object missing.')} />
    );
  }

  return (
    <>
      <Request
        on={ON.SURFACE}
        endpoint={endpoint}
        document={document}
        defaultValues={defaultValues}
        request={request}
        onSubmit={handleSubmit}
        className="h-full"
        renderHead={renderHead}
      />
      <Modal {...errorModal.bind}>
        {error && <Error on={ON.SURFACE} error={error} />}
      </Modal>
    </>
  );
};
