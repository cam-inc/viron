import classnames from 'classnames';
import React from 'react';
import { ON, On } from '$constants/index';

type Props = {
  on: On;
};
const Copyright: React.FC<Props> = ({ on }) => {
  return (
    <div
      className={classnames('text-xxs', {
        'text-on-background': on === ON.BACKGROUND,
        'text-on-surface': on === ON.SURFACE,
        'text-on-primary': on === ON.PRIMARY,
        'text-on-complementary': on === ON.COMPLEMENTARY,
      })}
    >
      © 2021 CAM, Inc
    </div>
  );
};
export default Copyright;
