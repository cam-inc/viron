import React from 'react';
import { Props as BaseProps } from '~/components';
import { Schema } from '~/types/oas';

export type Props = BaseProps & {
  schema: Schema;
  value: any[];
};
const CellForTypeArray: React.FC<Props> = ({ value }) => {
  return (
    <div className="whitespace-nowrap">
      <div className="text-sm">{JSON.stringify(value)}</div>
    </div>
  );
};
export default CellForTypeArray;
