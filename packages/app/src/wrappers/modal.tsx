import classnames from 'classnames';
import React from 'react';

export const ID = 'wrapper-modal';

type Props = {
  className?: string;
};
const ModalWrapper: React.FC<Props> = ({ className = '' }) => {
  return (
    <div id={ID} className={classnames('pointer-events-none', className)} />
  );
};

export default ModalWrapper;
