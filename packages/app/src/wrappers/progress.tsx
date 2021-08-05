import classnames from 'classnames';
import React from 'react';
import { ClassName } from '$types/index';

export const ID = 'wrapper-progress';

type Props = {
  className?: ClassName;
};
const ProgressWrapper: React.FC<Props> = ({ className = '' }) => {
  return (
    <div id={ID} className={classnames('pointer-events-none', className)} />
  );
};
export default ProgressWrapper;
