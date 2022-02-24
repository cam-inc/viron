import classnames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import XCircleIcon from '~/components/icon/xCircle/outline';
import Portal, { TARGET } from '~/portals';

type Props = {
  isOpened: boolean;
  onRequestClose: () => void;
  timeoutSec?: number;
};
const Notification: React.FC<Props> = ({
  isOpened,
  onRequestClose,
  timeoutSec = 5,
  children,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(isOpened);
  useEffect(() => {
    setIsVisible(isOpened);
  }, [isOpened]);

  const handleCloseButtonClick = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  // Request to close after some time have passed.
  useEffect(() => {
    if (!isOpened) {
      return;
    }
    let timeoutId: number;
    const cleanup = () => {
      window.clearTimeout(timeoutId);
    };
    if (timeoutSec) {
      timeoutId = window.setTimeout(() => {
        onRequestClose();
      }, 1000 * timeoutSec);
    }
    return cleanup;
  }, [isOpened, onRequestClose, timeoutSec]);

  if (!isOpened) {
    return null;
  }

  return (
    <Portal target={TARGET.NOTIFICATION}>
      <div className="flex justify-end mb-4 last:mb-0">
        <div
          className={classnames(
            'relative pffff-2 rounded shadow-04dp bg-thm-surface text-thm-on-surface transition duration-300 transform pointer-events-auto',
            {
              'opacity-0': !isVisible,
              'translate-x-4': !isVisible,
              'opacity-100': isVisible,
              'translate-x-0': isVisible,
            }
          )}
        >
          <div className="flex justify-end mb-2">
            <button onClick={handleCloseButtonClick}>
              <XCircleIcon className="text-lg text-thm-on-surface" />
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </Portal>
  );
};
export default Notification;

type UseNotificationReturn = {
  open: () => void;
  close: () => void;
  bind: {
    isOpened: boolean;
    onRequestClose: Props['onRequestClose'];
    timeoutSec?: Props['timeoutSec'];
  };
};
export const useNotification = ({
  timeoutSec,
}: { timeoutSec?: Props['timeoutSec'] } = {}): UseNotificationReturn => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const handleRequestClose = useCallback(() => {
    setIsOpened(false);
  }, []);
  const open = useCallback(() => {
    setIsOpened(true);
  }, []);
  const close = useCallback(() => {
    setIsOpened(false);
  }, []);

  const ret = useMemo<UseNotificationReturn>(
    () => ({
      open,
      close,
      bind: {
        isOpened,
        onRequestClose: handleRequestClose,
        timeoutSec,
      },
    }),
    [open, close, isOpened, handleRequestClose, timeoutSec]
  );
  return ret;
};
