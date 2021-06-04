import React from 'react';
import ReactDOM from 'react-dom';
import { isBrowser } from '$utils/index';
import { trace, debug } from '$utils/logger';

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
  const ee = new Error('roooooo');
  trace({ message: ee });
  debug({ message: 'debugggg' });

  return ReactDOM.createPortal(children, target);
};

export default Portal;
