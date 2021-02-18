import { PageProps } from 'gatsby';
import React from 'react';
import { useRecoilState } from 'recoil';
import Endpoint from '$components/endpoint';
import { listState as endpointListState } from '$store/atoms/endpoint';
import { Endpoint as TypeEndpoint } from '$types/index';
//import { Document } from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import Add from './_add/index';

type Props = PageProps;
const HomePage: React.FC<Props> = () => {
  const [endpointList, setEndpointList] = useRecoilState(endpointListState);

  const handleConnectButtonClick = function (endpoint: TypeEndpoint): void {
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
      if (response.ok) {
        // response.ok is true when response.status is 2xx.
        // Fetch suceeded. The OAS document is open to public.
        // TODO: add document to state.
        //const document: Document = await response.json();
        //document;
        return;
      }
      if (!response.ok && response.status === 401) {
        // Fetch succeeded but the OAS document requires authentication.
        // TODO: 認証開始
        return;
      }
    };
    f();
  };

  const handleDeleteButtonClick = function (endpoint: TypeEndpoint): void {
    setEndpointList(function (currVal) {
      return currVal.filter((_endpoint) => _endpoint.id !== endpoint.id);
    });
  };

  return (
    <div id="page-home">
      <ul>
        {endpointList.map(function (endpoint) {
          return (
            <React.Fragment key={endpoint.id}>
              <li className="mb-1 last:mb-0">
                <Endpoint
                  endpoint={endpoint}
                  onConnectButtonClick={handleConnectButtonClick}
                  onDeleteButtonClick={handleDeleteButtonClick}
                />
              </li>
            </React.Fragment>
          );
        })}
      </ul>
      <Add />
    </div>
  );
};

export default HomePage;
