import classnames from 'classnames';
import React from 'react';

export const ID = 'wrapper-drawer';

type Props = {
  className?: string;
};
const DrawerWrapper: React.FC<Props> = ({ className = '' }) => {
  return (
    <div id={ID} className={classnames('pointer-events-none', className)} />
  );
};
export default DrawerWrapper;
