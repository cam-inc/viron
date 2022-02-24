import classnames from 'classnames';
import React from 'react';
import { ClassName } from '~/types';

export const ID = 'wrapper-popover';

type Props = {
  className?: ClassName;
};
const PopoverWrapper: React.FC<Props> = ({ className = '' }) => {
  return (
    <div id={ID} className={classnames('pointer-events-none', className)} />
  );
};

export default PopoverWrapper;
