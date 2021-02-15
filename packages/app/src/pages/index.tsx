import { Link, PageProps } from 'gatsby';
import React from 'react';
import { useRecoilValue } from 'recoil';
import Endpoint from '$components/endpoint';
import { listState as endpointListState } from '$store/atoms/endpoint';

type Props = {} & PageProps;
const IndexPage: React.FC<Props> = () => {
  const endpointList = useRecoilValue(endpointListState);

  return (
    <div id="page-index">
      <ul>
        {endpointList.map(function (endpoint) {
          return (
            <li>
              <Endpoint endpoint={endpoint} />
            </li>
          );
        })}
      </ul>
      <Link to="/sample">sample</Link>
    </div>
  );
};

export default IndexPage;
