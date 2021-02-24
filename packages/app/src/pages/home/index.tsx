import { PageProps } from 'gatsby';
import React from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { listState as endpointListState } from '$store/atoms/endpoint';
import Add from './_add/index';
import Endpoint from './_endpoint';

type Props = PageProps;
const HomePage: React.FC<Props> = () => {
  const endpointList = useRecoilValue(endpointListState);

  return (
    <div id="page-home">
      <ul>
        {endpointList.map(function (endpoint) {
          return (
            <React.Fragment key={endpoint.id}>
              <li className="mb-1 last:mb-0">
                <Endpoint id={endpoint.id} />
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
