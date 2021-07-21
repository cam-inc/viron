import { IconType } from '@react-icons/all-files';
import { AiFillApi } from '@react-icons/all-files/ai/AiFillApi';
import { AiFillGoogleCircle } from '@react-icons/all-files/ai/AiFillGoogleCircle';
import { AiOutlineLogin } from '@react-icons/all-files/ai/AiOutlineLogin';
import { navigate } from 'gatsby';
import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import Button from '$components/button';
import Error from '$components/error';
import Drawer, { useDrawer } from '$components/drawer';
import Request from '$components/request';
import { ON } from '$constants/index';
import { remove, KEY, set } from '$storage/index';
import { AuthConfig, Endpoint } from '$types/index';
import { RequestValue } from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import {
  constructFakeDocument,
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
  getRequest,
} from '$utils/oas/index';

type Props = {
  endpoint: Endpoint;
  isSigninRequired: boolean;
};
const Signin: React.FC<Props> = ({ endpoint, isSigninRequired }) => {
  const authconfigOAuth = useMemo<AuthConfig | null>(
    function () {
      const _authconfig = _.find(endpoint.authConfigs, function (item) {
        return item.type === 'oauth';
      });
      return _authconfig || null;
    },
    [endpoint]
  );

  const authconfigEmail = useMemo<AuthConfig | null>(
    function () {
      const _authconfig = _.find(endpoint.authConfigs, function (item) {
        return item.type === 'email';
      });
      return _authconfig || null;
    },
    [endpoint]
  );

  const drawer = useDrawer();
  const handleClick = useCallback(
    function () {
      drawer.open();
    },
    [drawer]
  );
  const elm = useMemo<JSX.Element>(
    function () {
      return (
        <>
          <Button
            on="surface"
            Icon={AiFillApi}
            label="Signin"
            size="xs"
            onClick={handleClick}
          />
          <Drawer {...drawer.bind}>
            {authconfigOAuth && (
              <OAuth endpoint={endpoint} authConfig={authconfigOAuth} />
            )}
            {authconfigEmail && (
              <Email endpoint={endpoint} authConfig={authconfigEmail} />
            )}
          </Drawer>
        </>
      );
    },
    [endpoint, authconfigOAuth, authconfigEmail, handleClick, drawer]
  );

  if (!endpoint.isPrivate) {
    return null;
  }

  if (!isSigninRequired) {
    return null;
  }

  if (!authconfigOAuth || !authconfigEmail) {
    return null;
  }

  return elm;
};
export default Signin;

const OAuth: React.FC<{
  endpoint: Endpoint;
  authConfig: AuthConfig;
}> = ({ endpoint, authConfig }) => {
  const { pathObject } = authConfig;
  const document = constructFakeDocument({ paths: pathObject });
  const getRequestResult = getRequest(document);

  let Icon: IconType = AiOutlineLogin;
  if (authConfig.provider === 'google') {
    Icon = AiFillGoogleCircle;
  }

  const handleSubmit = useCallback(
    async function (requestValue: RequestValue) {
      if (getRequestResult.isFailure()) {
        return;
      }
      const request = getRequestResult.value;
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
    [endpoint, document, getRequestResult]
  );

  if (getRequestResult.isFailure()) {
    return <Error error={getRequestResult.value} />;
  }

  return (
    <div>
      <div className="flex items-center mb-2">
        <Icon className="mr-1" />
        <div className="text-xs">
          OAuth({`https://localhost:8000/oauthredirect`})
        </div>
      </div>
      <Request
        on={ON.SURFACE}
        endpoint={endpoint}
        document={document}
        request={getRequestResult.value}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

const Email: React.FC<{
  endpoint: Endpoint;
  authConfig: AuthConfig;
}> = ({ endpoint, authConfig }) => {
  const { pathObject } = authConfig;
  const document = constructFakeDocument({ paths: pathObject });
  const getRequestResult = getRequest(document);

  const handleSubmit = useCallback(
    async function (requestValue: RequestValue) {
      if (getRequestResult.isFailure()) {
        return;
      }
      const request = getRequestResult.value;
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
        // TODO
        return;
      }
      if (!response.ok) {
        // TODO
        return;
      }
      navigate(`/endpoints/${endpoint.id}`);
    },
    [endpoint, document, getRequestResult]
  );

  if (getRequestResult.isFailure()) {
    return <Error error={getRequestResult.value} />;
  }

  return (
    <div>
      <div className="flex items-center mb-2">
        <AiOutlineLogin className="mr-1" />
        <div className="text-xs">Email</div>
      </div>
      <Request
        on={ON.SURFACE}
        endpoint={endpoint}
        document={document}
        request={getRequestResult.value}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
