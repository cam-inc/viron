import React from 'react';
import ReactDOM from 'react-dom';
import { isBrowser } from '$utils';

type Props = {
  targetId: string;
};
const Portal: React.FC<Props> = ({ targetId, children }) => {
  if (!isBrowser) {
    return null;
  }
  return ReactDOM.createPortal(
    children,
    document.querySelector(`#${targetId}`)
  );
};

export default Portal;
