import classsnames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import Portal from '$components/portal';
import { ID } from '$wrappers/progress';

type Props = {
  isOpened: boolean;
  onRequestClose: () => void;
};
const Progress: React.FC<Props> = ({ isOpened, onRequestClose, children }) => {
  const [isVisible, setIsVisible] = useState<boolean>(isOpened);
  useEffect(
    function () {
      setIsVisible(isOpened);
    },
    [isOpened]
  );

  const handleClick = useCallback(
    function () {
      onRequestClose();
    },
    [onRequestClose]
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
        onClick={handleClick}
      >
        <div>{children}</div>
      </div>
    </Portal>
  );
};
export default Progress;

export const useProgress = function (): {
  open: () => void;
  close: () => void;
  bind: {
    isOpened: boolean;
    onRequestClose: Props['onRequestClose'];
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
    },
  };
};
