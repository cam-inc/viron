import React from 'react';
import { ContentGetResponseOfTypeOfNumber } from '$types/oas';

type Props = {
  data: ContentGetResponseOfTypeOfNumber;
};
const _ContentTable: React.FC<Props> = ({ data }) => {
  return (
    <div>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};
export default _ContentTable;
