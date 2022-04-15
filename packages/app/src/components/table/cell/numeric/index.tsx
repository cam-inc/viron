import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';
import { Schema } from '~/types/oas';

export type Props = BaseProps & {
  schema: Schema;
  value: number;
};
const CellForTypeNumeric: React.FC<Props> = ({ on, schema, value }) => {
  return (
    <div className="whitespace-nowrap">
      <div className={classnames(`text-sm text-thm-on-${on}`)}>
        {value.toLocaleString()}
      </div>
    </div>
  );
};
export default CellForTypeNumeric;
