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
      <p>{endpoint.id}</p>
      <p>{endpoint.url}</p>
      <button onClick={handleConnectButtonClick}>
        <AiFillApi className="inline" />
        <span>connect</span>
      </button>
      <button onClick={handleDeleteButtonClick}>
        <AiFillDelete className="inline" />
        <span>remove</span>
      </button>
      {!!endpoint.authTypes &&
        endpoint.authTypes.map((authType) => (
          <React.Fragment key={authType.type}>
            <Auth
              authType={authType}
              onOAuthSignin={handleOAuthSignin}
              onEmailSignin={handleEmailSignin}
              onSignout={handleSignout}
            />
          </React.Fragment>
        ))}
    </div>
  );
};

export default _Endpoint;
