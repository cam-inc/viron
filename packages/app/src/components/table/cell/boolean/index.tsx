import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';
import { Schema } from '~/types/oas';

export type Props = BaseProps & {
  schema: Schema;
  value: boolean;
};
const CellForTypeBoolean: React.FC<Props> = ({ on, schema, value }) => {
  return (
    <div className="whitespace-nowrap">
      <div className={classnames(`text-sm text-thm-on-${on}`)}>
        {value ? 'TRUE' : 'FALSE'}
      </div>
    </div>
  );
};
export default CellForTypeBoolean;
