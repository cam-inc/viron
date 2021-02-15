import React from 'react';
import { Endpoint } from '$types/index';

type Props = {
  endpoint: Endpoint;
};
const _Endpoint: React.FC<Props> = ({ endpoint }) => {
  return (
    <div>
      <p>{endpoint.id}</p>
      <p>{endpoint.url}</p>
    </div>
  );
};

export default _Endpoint;
