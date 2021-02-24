import { navigate } from 'gatsby';
import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import Endpoint from '$components/endpoint';
import { oneState } from '$store/selectors/endpoint';
import { AuthType, Endpoint as TypeEndpoint, EndpointID } from '$types/index';
import { Document } from '$types/oas';
import { promiseErrorHandler } from '$utils/index';

type Props = {
  id: EndpointID;
};
const _Endpoint: React.FC<Props> = ({ id }) => {
  const [endpoint, setEndpoint] = useRecoilState(oneState({ id }));

  if (!endpoint) {
    throw new Error('Endpoint not found.');
  }

  const handleConnectButtonClick = useCallback(
    function () {
      const f = async function (): Promise<void> {
        const [response, responseError] = await promiseErrorHandler(
          fetch(endpoint.url, {
            mode: 'cors',
          })
        );
        if (!!responseError) {
          // Network error.
          // TODO: show error.
          return;
        }
        // TODO: 既にログイン済みの場合への対応。

        if (response.ok) {
          // response.ok is true when response.status is 2xx.
          // Fetch suceeded. The OAS document is open to public.
          const document: Document = await response.json();
          setEndpoint({ ...endpoint, document });
          navigate(`/endpoints/${endpoint.id}`);
          return;
        }
        if (!response.ok && response.status === 401) {
          // Fetch succeeded but the OAS document requires authentication.
          // TODO: 認証開始
          const [response, responseError] = await promiseErrorHandler(
            fetch(`${new URL(endpoint.url).origin}/viron_authtype`, {
              mode: 'cors',
            })
          );
          if (!!responseError) {
            // TODO
            return;
          }
          const authTypes: AuthType[] = await response.json();
          console.log(authTypes);
          return;
        }
      };
      f();
    },
    [endpoint]
  );

  const handleDeleteButtonClick = function (): void {
    setEndpoint(function (currVal) {
      return { ...currVal, deleted: true };
    });
  };

  return (
    <Endpoint
      endpoint={endpoint}
      onConnectButtonClick={handleConnectButtonClick}
      onDeleteButtonClick={handleDeleteButtonClick}
    />
  );
};

export default _Endpoint;
