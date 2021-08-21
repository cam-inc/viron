import classnames from 'classnames';
import React from 'react';
import CommonMark from '$components/commonMark';
import { On, ON } from '$constants/index';
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
        {
          'bg-on-background-faint text-on-background': on === ON.BACKGROUND,
          'bg-on-surface-faint text-on-surface': on === ON.SURFACE,
          'bg-on-primary-faint text-on-primary': on === ON.PRIMARY,
          'bg-on-complementary-faint text-on-complementary':
            on === ON.COMPLEMENTARY,
        },
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
