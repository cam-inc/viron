import { IconType } from '@react-icons/all-files';
import { AiFillGoogleCircle } from '@react-icons/all-files/ai/AiFillGoogleCircle';
import { AiOutlineLogin } from '@react-icons/all-files/ai/AiOutlineLogin';
import { AiOutlineLogout } from '@react-icons/all-files/ai/AiOutlineLogout';
import { navigate } from 'gatsby';
import React from 'react';
import Request from '$components/request';
import { remove, KEY, set } from '$storage/index';
import { AuthConfig, Endpoint } from '$types/index';
import { Document, RequestValue } from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import {
  constructFakeDocument,
  constructRequestInfo,
  constructRequestInit,
  constructRequestPayloads,
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

  let Icon: IconType = AiOutlineLogin;
  if (authConfig.provider === 'google') {
    Icon = AiFillGoogleCircle;
  }

  const handleSubmit = async function (requestValue: RequestValue) {
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
  };

  return (
    <div>
      <Icon className="inline" />
      <span>OAuth</span>
      <p>{`https://localhost:8000/oauthredirect`}</p>
      <Request request={request} onSubmit={handleSubmit} />
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

  const handleSubmit = async function (requestValue: RequestValue) {
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
  };

  return (
    <div>
      <AiOutlineLogin className="inline" />
      <span>Email</span>
      <Request request={request} onSubmit={handleSubmit} />
    </div>
  );
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
  const { pathObject } = authConfig;
  const document: Document = constructFakeDocument({ paths: pathObject });
  const request = getRequest(document);

  if (!request) {
    throw new Error('TODO');
  }

  const handleSubmit = async function (requestValue: RequestValue) {
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
    onSignout();
  };

  return (
    <div>
      <AiOutlineLogout className="inline" />
      <span>Signout</span>
      <Request request={request} onSubmit={handleSubmit} />
    </div>
  );
};
