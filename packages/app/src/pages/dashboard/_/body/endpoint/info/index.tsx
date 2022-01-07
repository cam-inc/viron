import React from 'react';
import { Endpoint } from '~/types';

type Props = {
  endpoint: Endpoint;
};
const Info: React.FC<Props> = ({ endpoint }) => {
  return (
    <div className="text-thm-on-surface">
      <div>{endpoint.url}</div>
      <div>TODO: Endpointに関する情報を可能な限り表示。</div>
    </div>
  );
};
export default Info;
