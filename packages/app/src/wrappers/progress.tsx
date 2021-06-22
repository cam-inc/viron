import classnames from 'classnames';
import React from 'react';

export const ID = 'wrapper-progress';

type Props = {
  className?: string;
};
const ProgressWrapper: React.FC<Props> = ({ className = '' }) => {
  return (
    <div id={ID} className={classnames('pointer-events-none', className)} />
  );
};
export default ProgressWrapper;
