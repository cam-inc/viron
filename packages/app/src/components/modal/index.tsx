import React from 'react';
import Portal from '@components/portal';

type Props = {
  isOpened: boolean;
};
const Modal: React.FC<Props> = ({ isOpened = false, children }) => {
  if (!isOpened) {
    return null;
  }
  return <Portal targetId="container-modal">{children}</Portal>;
};

export default Modal;
