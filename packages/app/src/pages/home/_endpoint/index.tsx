import { navigate } from 'gatsby';
import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Endpoint from '$components/endpoint';
import { listState } from '$store/atoms/endpoint';
import { oneState } from '$store/selectors/endpoint';
import {
  AuthType,
  AuthTypeEmailFormData,
  Endpoint as TypeEndpoint,
  EndpointID,
  Token,
} from '$types/index';
import { promiseErrorHandler } from '$utils/index';

type Props = {
  id: EndpointID;
};
const _Endpoint: React.FC<Props> = ({ id }) => {
  const [endpoint, setEndpoint] = useRecoilState(oneState({ id }));
  const setEndpoints = useSetRecoilState(listState);

  if (!endpoint) {
    throw new Error('Endpoint not found.');
  }

  const handleConnectButtonClick = function () {
    navigate(`/endpoints/${endpoint.id}`);
  };

  const handleDeleteButtonClick = function (): void {
    setEndpoints(function (currVal) {
      return currVal.filter(function (_endpoint) {
        return _endpoint.id !== endpoint.id;
      });
    });
  };

  const handleOAuthSignin = function (
    endpoint: TypeEndpoint,
    authType: AuthType
  ) {
    const origin = new URL(endpoint.url).origin;
    const redirectUrl = encodeURIComponent(
      `${new URL(location.href).origin}/oauthredirect/${endpoint.id}`
    );
    const fetchUrl = `${origin}${authType.url}?redirect_url=${redirectUrl}`;
    location.href = fetchUrl;
  };

  const handleEmailSignin = function (
    endpoint: TypeEndpoint,
    authType: AuthType,
    data: AuthTypeEmailFormData
  ) {
    const f = async function (): Promise<void> {
      const [response, responseError] = await promiseErrorHandler(
        fetch(`${new URL(endpoint.url).origin}${authType.url}`, {
          method: authType.method,
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      if (!!responseError) {
        // TODO
        return;
      }
      if (!response.ok) {
        // TODO
        return;
      }
      const token = response.headers.get('Authorization') as Token;
      setEndpoint({ ...endpoint, token });
    };
    f();
  };

  const handleSignout = function (endpoint: TypeEndpoint, authType: AuthType) {
    const f = async function (): Promise<void> {
      const [response, responseError] = await promiseErrorHandler(
        fetch(`${new URL(endpoint.url).origin}${authType.url}`, {
          method: authType.method,
        })
      );
      if (!!responseError) {
        // TODO
        return;
      }
      if (!response.ok) {
        // TODO
        return;
      }
      setEndpoint({ ...endpoint, token: null });
    };
    f();
  };

  return (
    <Endpoint
      endpoint={endpoint}
      onConnectButtonClick={handleConnectButtonClick}
      onDeleteButtonClick={handleDeleteButtonClick}
      onOAuthSignin={handleOAuthSignin}
      onEmailSignin={handleEmailSignin}
      onSignout={handleSignout}
    />
  );
};

export default _Endpoint;
