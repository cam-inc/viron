import classnames from 'classnames';
import React from 'react';
import { On } from '$constants/index';
import pkg from '../../../../package.json';

type Props = {
  on: On;
};
const Version: React.FC<Props> = ({ on }) => {
  return (
    <div className={classnames('text-xxs', `text-on-${on}`)}>
      ver. {pkg.version}
    </div>
  );
};
export default Version;
