import React from 'react';
import ReactDOM from 'react-dom';
import { isBrowser } from '$utils/index';

type Props = {
  targetId: string;
};
const Portal: React.FC<Props> = ({ targetId, children }) => {
  if (!isBrowser) {
    return null;
  }
  const target = document.querySelector(`#${targetId}`);
  if (!target) {
    return null;
  }
  return ReactDOM.createPortal(children, target);
};

export default Portal;
