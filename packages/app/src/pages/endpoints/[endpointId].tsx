import { PageProps } from 'gatsby';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { oneState as endpointOneState } from '$store/selectors/endpoint';

type Props = PageProps;
const EndpointOnePage: React.FC<Props> = ({ params }) => {
  const endpoint = useRecoilValue(endpointOneState({ id: params.endpointId }));

  return (
    <div id="page-endpointOne">
      {!endpoint ? (
        <p>not found...</p>
      ) : (
        <div>
          <p>{endpoint.id}</p>
          <p>{endpoint.url}</p>
          <p>{JSON.stringify(endpoint.document)}</p>
        </div>
      )}
    </div>
  );
};

export default EndpointOnePage;
