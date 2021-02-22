import classnames from 'classnames';
import React from 'react';

export const id = 'wrapper-modal';

type Props = {
  className?: string;
};
const ModalWrapper: React.FC<Props> = ({ className = '' }) => {
  return (
    <div id={id} className={classnames('pointer-events-none', className)} />
  );
};

export default ModalWrapper;
