import classnames from 'classnames';
import React from 'react';
import { ClassName } from '~/types';

export const ID = 'wrapper-drawer';

type Props = {
  className?: ClassName;
};
const DrawerWrapper: React.FC<Props> = ({ className = '' }) => {
  return (
    <div id={ID} className={classnames('pointer-events-none', className)} />
  );
};
export default DrawerWrapper;
