import { AiFillApi } from '@react-icons/all-files/ai/AiFillApi';
import { AiFillDelete } from '@react-icons/all-files/ai/AiFillDelete';
import React from 'react';
import Auth from '$components/auth';
import { AuthType, AuthTypeEmailFormData, Endpoint } from '$types/index';

type Props = {
  endpoint: Endpoint;
  onConnectButtonClick?: (endpoint: Endpoint) => void;
  onDeleteButtonClick?: (endpoint: Endpoint) => void;
  onOAuthSignin?: (endpoint: Endpoint, authType: AuthType) => void;
  onEmailSignin?: (
    endpoint: Endpoint,
    authType: AuthType,
    data: AuthTypeEmailFormData
  ) => void;
  onSignout?: (endpoint: Endpoint, authType: AuthType) => void;
};
const _Endpoint: React.FC<Props> = ({
  endpoint,
  onConnectButtonClick,
  onDeleteButtonClick,
  onOAuthSignin,
  onEmailSignin,
  onSignout,
}) => {
  const handleConnectButtonClick = function (): void {
    onConnectButtonClick?.(endpoint);
  };
  const handleDeleteButtonClick = function (): void {
    onDeleteButtonClick?.(endpoint);
  };
  const handleOAuthSignin = function (authType: AuthType): void {
    onOAuthSignin?.(endpoint, authType);
  };
  const handleEmailSignin = function (
    authType: AuthType,
    data: AuthTypeEmailFormData
  ): void {
    onEmailSignin?.(endpoint, authType, data);
  };
  const handleSignout = function (authType: AuthType): void {
    onSignout?.(endpoint, authType);
  };

  return (
    <div className="p-2 border rounded text-xxs">
      <p>ID: {endpoint.id}</p>
      <p>URL: {endpoint.url}</p>
      <p>isPrivate: {endpoint.isPrivate.toString()}</p>
      <p>token: {endpoint.token || '-'}</p>
      {!endpoint.isPrivate || (endpoint.isPrivate && !!endpoint.token) ? (
        <button onClick={handleConnectButtonClick}>
          <AiFillApi className="inline" />
          <span>connect</span>
        </button>
      ) : (
        endpoint.authTypes.map((authType) => (
          <React.Fragment key={authType.type}>
            <Auth
              authType={authType}
              onOAuthSignin={handleOAuthSignin}
              onEmailSignin={handleEmailSignin}
              onSignout={handleSignout}
            />
          </React.Fragment>
        ))
      )}
      <button onClick={handleDeleteButtonClick}>
        <AiFillDelete className="inline" />
        <span>remove</span>
      </button>
    </div>
  );
};

export default _Endpoint;
