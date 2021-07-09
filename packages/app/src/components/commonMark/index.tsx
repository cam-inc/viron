import classnames from 'classnames';
import React from 'react';
import { ON, On } from '$constants/index';
import { ClassName } from '$types/index';
import { CommonMark as CommonMarkType } from '$types/oas';

type Props = {
  on: On;
  data: CommonMarkType;
  className?: ClassName;
};
// TODO
const CommonMark: React.FC<Props> = ({ on, data, className = '' }) => {
  return (
    <div
      className={classnames('text-xxs', className, {
        'text-on-background': on === ON.BACKGROUND,
        'text-on-surface': on === ON.SURFACE,
        'text-on-primary': on === ON.PRIMARY,
        'text-on-complementary': on === ON.COMPLEMENTARY,
      })}
    >
      {data}
    </div>
  );
};
export default CommonMark;
