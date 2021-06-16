import React from 'react';

type Props = {
  data: any;
};
const _ContentTable: React.FC<Props> = ({ data }) => {
  return (
    <div>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};
export default _ContentTable;
