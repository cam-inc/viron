import classnames from 'classnames';
import React from 'react';

export const ID = 'wrapper-popover';

type Props = {
  className?: string;
};
const PopoverWrapper: React.FC<Props> = ({ className = '' }) => {
  return (
    <div id={ID} className={classnames('pointer-events-none', className)} />
  );
};

export default PopoverWrapper;
