import React from 'react';
import { Props as BaseProps } from '@/components';
import { Schema } from '@/types/oas';

export type Props = BaseProps & {
  schema: Schema;
  value: number;
};
const CellForTypeNumeric: React.FC<Props> = ({ value }) => {
  return (
    <div className="whitespace-nowrap">
      <div className="text-sm">{value.toLocaleString()}</div>
    </div>
  );
};
export default CellForTypeNumeric;
