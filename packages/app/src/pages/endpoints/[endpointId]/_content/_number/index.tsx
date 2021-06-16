import React from 'react';

type Props = {
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
