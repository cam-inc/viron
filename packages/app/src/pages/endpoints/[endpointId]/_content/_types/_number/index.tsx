import React from 'react';
import { Document, Info } from '$types/oas';

type Props = {
  document: Document;
  content: Info['x-pages'][number]['contents'][number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};
const _ContentNumber: React.FC<Props> = ({ data }) => {
  return (
    <div>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};
export default _ContentNumber;
