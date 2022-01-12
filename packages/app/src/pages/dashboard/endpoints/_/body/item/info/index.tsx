import React from 'react';
import { Endpoint } from '~/types';
import { Document } from '~/types/oas';

type Props = {
  endpoint: Endpoint;
  document?: Document;
};
const Info: React.FC<Props> = ({ endpoint, document }) => {
  return (
    <div className="text-thm-on-surface">
      <div>{endpoint.url}</div>
      <div>{document?.info.title}</div>
      <div>TODO: Endpointに関する情報を可能な限り表示。</div>
    </div>
  );
};
export default Info;
