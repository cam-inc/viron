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

  const handleCloseButtonClick = useCallback(function () {
    onRequestClose();
  }, []);

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
    [isOpened]
  );

  if (!isOpened) {
    return null;
  }

  return (
    <Portal targetId={ID}>
      <div
        className={classsnames(
          'bg-white transition-opacity pointer-events-auto',
          {
            'opacity-0': !isVisible,
            'opacity-100': isVisible,
          }
        )}
      >
        <button onClick={handleCloseButtonClick}>close</button>
        <div>{children}</div>
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
