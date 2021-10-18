import classnames from 'classnames';
import React from 'react';
import CommonMark from '$components/commonMark';
import { On } from '$constants/index';
import { ClassName } from '$types/index';
import { Schema } from '$types/oas';

export type Props = {
  on: On;
  schema: Schema;
  className?: ClassName;
};
const Info: React.FC<Props> = ({ on, schema, className = '' }) => {
  return (
    <div
      className={classnames(
        'p-1 text-xxs',
        `bg-on-${on}-faint text-on-${on}`,
        className
      )}
    >
      <div>type: {schema.type}</div>
      {schema.title && <div>{schema.title}</div>}
      {schema.description && <CommonMark on={on} data={schema.description} />}
    </div>
  );
};
export default Info;
