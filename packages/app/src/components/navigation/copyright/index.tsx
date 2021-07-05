import classnames from 'classnames';
import React from 'react';

type Props = {
  className: string;
};
const Copyright: React.FC<Props> = ({ className }) => {
  return (
    <div className={classnames('text-xxs', className)}>© 2021 CAM, Inc</div>
  );
};
export default Copyright;
