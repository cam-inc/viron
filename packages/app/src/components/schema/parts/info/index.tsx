import classnames from 'classnames';
import React from 'react';
import { Props as BaseProps } from '@/components';
import CommonMark from '@/components/commonMark';
import { Schema } from '@/types/oas';

export type Props = BaseProps & {
  schema: Schema;
};
const Info: React.FC<Props> = ({ schema, className = '' }) => {
  return (
    <div
      className={classnames(`p-1 text-xxs bg-muted text-foreground`, className)}
    >
      <div>type: {schema.type}</div>
      {schema.title && <div>{schema.title}</div>}
      {schema.description && <CommonMark data={schema.description} />}
    </div>
  );
};
export default Info;
