import classnames from 'classnames';
import React from 'react';

export const ID = 'wrapper-notification';

type Props = {
  className?: string;
};
const NotificationWrapper: React.FC<Props> = ({ className = '' }) => {
  return (
    <div id={ID} className={classnames('pointer-events-none', className)} />
  );
};
export default NotificationWrapper;
