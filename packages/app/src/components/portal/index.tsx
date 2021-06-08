import React from 'react';
import ReactDOM from 'react-dom';
import { isBrowser } from '$utils/index';
import { error } from '$utils/logger';

type Props = {
  targetId: string;
};
const Portal: React.FC<Props> = ({ targetId, children }) => {
  if (!isBrowser) {
    return null;
  }
  const target = document.querySelector(`#${targetId}`);
  if (!target) {
    error({ message: `Element #${targetId} not found.` });
    return null;
  }
  return ReactDOM.createPortal(children, target);
};

export default Portal;
