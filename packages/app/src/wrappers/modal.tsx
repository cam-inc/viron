import classnames from 'classnames';
import React from 'react';
import { ClassName } from '$types/index';

export const ID = 'wrapper-modal';

type Props = {
  className?: ClassName;
};
const ModalWrapper: React.FC<Props> = ({ className = '' }) => {
  return (
    <div id={ID} className={classnames('pointer-events-none', className)} />
  );
};

export default ModalWrapper;
