import { PageProps } from 'gatsby';
import React from 'react';
import { useRecoilState } from 'recoil';
import Endpoint from '$components/endpoint';
import { listState as endpointListState } from '$store/atoms/endpoint';
import { Endpoint as TypeEndpoint } from '$types/index';
import Add from './_add/index';

type Props = {} & PageProps;
const HomePage: React.FC<Props> = () => {
  const [endpointList, setEndpointList] = useRecoilState(endpointListState);

  const handleConnectButtonClick = function (endpoint: TypeEndpoint): void {
    const f = async function (): Promise<void> {
      const response = await fetch(endpoint.url, {
        mode: 'cors',
        redirect: 'follow',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
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
