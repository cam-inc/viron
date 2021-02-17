import { AiFillApi } from '@react-icons/all-files/ai/AiFillApi';
import { AiFillDelete } from '@react-icons/all-files/ai/AiFillDelete';
import React from 'react';
import { Endpoint } from '$types/index';

type Props = {
  endpoint: Endpoint;
  onConnectButtonClick?: (endpoint: Endpoint) => void;
  onRemoveButtonClick?: (endpoint: Endpoint) => void;
};
const _Endpoint: React.FC<Props> = ({
  endpoint,
  onConnectButtonClick,
  onDeleteButtonClick,
}) => {
  const handleConnectButtonClick = function (): void {
    onConnectButtonClick?.(endpoint);
  };
  const handleDeleteButtonClick = function (): void {
    onDeleteButtonClick?.(endpoint);
  };

  return (
    <div className="p-2 border rounded text-xxs">
      <p>{endpoint.id}</p>
      <p>{endpoint.url}</p>
      <p>ping: {endpoint.ping.toString()}</p>
      {!endpoint.ping ? (
        <button onClick={handleConnectButtonClick}>
          <AiFillApi className="inline" />
          <span>connect</span>
        </button>
      ) : (
        <p>connected</p>
      )}
      <button onClick={handleDeleteButtonClick}>
        <AiFillDelete className="inline" />
        <span>remove</span>
      </button>
    </div>
  );
};

export default _Endpoint;
