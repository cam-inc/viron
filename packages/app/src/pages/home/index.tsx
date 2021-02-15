import { Link, PageProps } from 'gatsby';
import React from 'react';
import { useRecoilValue } from 'recoil';
import Endpoint from '$components/endpoint';
import { listState as endpointListState } from '$store/atoms/endpoint';
import Add from './_add/index';

type Props = {} & PageProps;
const HomePage: React.FC<Props> = () => {
  const endpointList = useRecoilValue(endpointListState);

  return (
    <div id="page-home">
      <ul>
        {endpointList.map(function (endpoint) {
          return (
            <li>
              <Endpoint endpoint={endpoint} />
            </li>
          );
        })}
      </ul>
      <Add />
      <Link to="/sample">sample</Link>
    </div>
  );
};

export default HomePage;
