import { IconType } from '@react-icons/all-files';
import { AiFillGoogleCircle } from '@react-icons/all-files/ai/AiFillGoogleCircle';
import { AiOutlineLogin } from '@react-icons/all-files/ai/AiOutlineLogin';
import { AiOutlineLogout } from '@react-icons/all-files/ai/AiOutlineLogout';
import { navigate } from 'gatsby';
import React from 'react';
import Request from '$components/request';
import Textinput from '$components/textinput';
import { AuthConfig, Endpoint } from '$types/index';
import {
  Document,
  RequestPayloadParameter,
  RequestPayloadRequestBody,
} from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import {
  constructFakeDocument,
  constructRequestInfo,
  constructRequestInit,
  getRequest,
} from '$utils/oas/index';

type PropsOAuth = {
  authConfig: AuthConfig;
  endpoint: Endpoint;
};
export const OAuth: React.FC<PropsOAuth> = ({ authConfig, endpoint }) => {
  const { pathObject } = authConfig;
  const document: Document = constructFakeDocument({ paths: pathObject });
  const request = getRequest(document);

  if (!request) {
    throw new Error('TODO');
  }

  // TODO: operation仕様に合わせること。
  let Icon: IconType = AiOutlineLogin;
  if (authConfig.provider === 'google') {
    Icon = AiFillGoogleCircle;
  }
  const handleClick = async function () {
    // TODO: requestPayloadParametersを作成。
    // TODO: requestPayloadRequestBodyを作成。
    const requestInfo: RequestInfo = constructRequestInfo(
      endpoint,
      document,
      request
    );
    const requestInit: RequestInit = constructRequestInit(request);
    const [response, responseError] = await promiseErrorHandler(
      fetch(requestInfo, requestInit)
    );
    /*
    const redirectUrl = encodeURIComponent(
      `${new URL(location.href).origin}/oauthredirect?endpointId=${endpoint.id}`
    );
    const [response, responseError] = await promiseErrorHandler(
      fetch(
        `${new URL(endpoint.url).origin}${pathname}?endpointId=${endpoint.id
        }&redirect_uri=${redirectUrl}`
      )
    );
    */
    if (!!responseError) {
      // TODO
      return;
    }
    if (!response.ok) {
      // TODO
      return;
    }
    location.href = 'TODO: response.body';
  };
  return (
    <div onClick={handleClick}>
      <Icon className="inline" />
      <span>OAuth</span>
    </div>
  );
};

type PropsEmail = {
  authConfig: AuthConfig;
  endpoint: Endpoint;
};
export const Email: React.FC<PropsEmail> = ({ authConfig, endpoint }) => {
  const { pathObject } = authConfig;
  const document: Document = constructFakeDocument({ paths: pathObject });
  const request = getRequest(document);

  if (!request) {
    throw new Error('TODO');
  }

  const handleSubmit = async function ({
    requestPayloadParameters,
    requestPayloadRequestBody,
  }: {
    requestPayloadParameters?: RequestPayloadParameter[];
    requestPayloadRequestBody?: RequestPayloadRequestBody;
  } = {}) {
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
  };

  return <Request request={request} onSubmit={handleSubmit} />;
};

type PropsSignout = {
  authConfig: AuthConfig;
  endpoint: Endpoint;
  onSignout: () => void;
};
export const Signout: React.FC<PropsSignout> = ({
  authConfig,
  endpoint,
  onSignout,
}) => {
  const handleClick = async function (): Promise<void> {
    const { pathObject } = authConfig;
    const document: Document = constructFakeDocument({ paths: pathObject });
    const request = getRequest(document);
    if (!request) {
      throw new Error('TODO');
    }
    // TODO: requestPayloadParametersを作成。
    // TODO: requestPayloadRequestBodyを作成。
    const requestInfo: RequestInfo = constructRequestInfo(
      endpoint,
      document,
      request
    );
    const requestInit: RequestInit = constructRequestInit(request);

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
    onSignout();
  };
  return (
    <div onClick={handleClick}>
      <AiOutlineLogout className="inline" />
      <span>signout</span>
    </div>
  );
};
