import React, { PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';
import { BaseError } from '~/errors';
import { isBrowser } from '~/utils';
import { error } from '~/utils/logger';
import { ID as MODAL_WRAPPER_ID } from '~/wrappers/modal';
import { ID as NOTIFICATION_WRAPPER_ID } from '~/wrappers/notification';
import { ID as POPOVER_WRAPPER_ID } from '~/wrappers/popover';
import { ID as PROGRESS_WRAPPER_ID } from '~/wrappers/progress';

export const TARGET = {
  MODAL: MODAL_WRAPPER_ID,
  NOTIFICATION: NOTIFICATION_WRAPPER_ID,
  POPOVER: POPOVER_WRAPPER_ID,
  PROGRESS: PROGRESS_WRAPPER_ID,
} as const;
export type Target = (typeof TARGET)[keyof typeof TARGET];

type Props = {
  target: Target;
};
const Portal: React.FC<PropsWithChildren<Props>> = ({ target, children }) => {
  if (!isBrowser) {
    return null;
  }
  const targetElm = document.querySelector(`#${target}`);
  if (!targetElm) {
    error({ messages: [new BaseError(`Element #${target} not found.`)] });
    return null;
  }
  return ReactDOM.createPortal(children, targetElm);
};

export default Portal;
