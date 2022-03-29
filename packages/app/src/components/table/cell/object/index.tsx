import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '~/components';
import { Schema } from '~/types/oas';

export type Props = BaseProps & {
  schema: Schema;
  value: Record<string, any>;
};
const CellForTypeObject: React.FC<Props> = ({ on, schema, value }) => {
  return (
    <div className="whitespace-nowrap">
      <div className={classnames(`text-sm text-thm-on-${on}`)}>
        {JSON.stringify(value)}
      </div>
    </div>
  );
};
export default CellForTypeObject;
