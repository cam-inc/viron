import React from 'react';
import { Props as BaseProps } from '~/components';
import { Schema } from '~/types/oas';

export type Props = BaseProps & {
  schema: Schema;
  value: null | undefined;
};
const CellForTypeNullish: React.FC<Props> = () => {
  return (
    <div className="whitespace-nowrap">
      <div className="text-sm text-muted-foreground">-</div>
    </div>
  );
};
export default CellForTypeNullish;
