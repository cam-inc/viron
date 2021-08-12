import classnames from 'classnames';
import React from 'react';
import { ON, On } from '$constants/index';
import pkg from '../../../../package.json';

type Props = {
  on: On;
};
const Version: React.FC<Props> = ({ on }) => {
  return (
    <div
      className={classnames('text-xxs', {
        'text-on-background': on === ON.BACKGROUND,
        'text-on-surface': on === ON.SURFACE,
        'text-on-primary': on === ON.PRIMARY,
        'text-on-complementary': on === ON.COMPLEMENTARY,
      })}
    >
      ver. {pkg.version}
    </div>
  );
};
export default Version;
