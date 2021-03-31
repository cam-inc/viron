import React from 'react';
import { ContentGetResponseOfTypeOfNumber } from '$types/oas';

type Props = {
  data: ContentGetResponseOfTypeOfNumber;
};
const _ContentNumber: React.FC<Props> = ({ data }) => {
  return (
    <div>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};
export default _ContentNumber;
