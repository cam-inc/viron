import classsnames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import Portal from '$components/portal';
import { ID } from '$wrappers/notification';

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
  useEffect(
    function () {
      setIsVisible(isOpened);
    },
    [isOpened]
  );

  const handleCloseButtonClick = useCallback(
    function () {
      onRequestClose();
    },
    [onRequestClose]
  );

  // Request to close after some time have passed.
  useEffect(
    function () {
      if (!isOpened) {
        return;
      }
      let timeoutId: number;
      const cleanup = function () {
        window.clearTimeout(timeoutId);
      };
      if (timeoutSec) {
        timeoutId = window.setTimeout(function () {
          onRequestClose();
        }, 1000 * timeoutSec);
      }
      return cleanup;
    },
    [isOpened, onRequestClose, timeoutSec]
  );

  if (!isOpened) {
    return null;
  }

  return (
    <Portal targetId={ID}>
      <div className="flex justify-end mb-4 last:mb-0">
        <div
          className={classsnames(
            'relative p-4 rounded shadow-04dp bg-surface-04dp text-on-surface transition duration-300 transform pointer-events-auto',
            {
              'opacity-0': !isVisible,
              'translate-x-4': !isVisible,
              'opacity-100': isVisible,
              'translate-x-0': isVisible,
            }
          )}
        >
          <button onClick={handleCloseButtonClick}>close</button>
          <div>{children}</div>
        </div>
      </div>
    </Portal>
  );
};
export default Notification;

export const useNotification = function ({
  timeoutSec,
}: { timeoutSec?: Props['timeoutSec'] } = {}): {
  open: () => void;
  close: () => void;
  bind: {
    isOpened: boolean;
    onRequestClose: Props['onRequestClose'];
    timeoutSec?: Props['timeoutSec'];
  };
} {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const handleRequestClose = useCallback(function () {
    setIsOpened(false);
  }, []);
  const open = useCallback(function () {
    setIsOpened(true);
  }, []);
  const close = useCallback(function () {
    setIsOpened(false);
  }, []);

  return {
    open,
    close,
    bind: {
      isOpened,
      onRequestClose: handleRequestClose,
      timeoutSec,
    },
  };
};
