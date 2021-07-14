import classnames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import Portal from '$components/portal';
import { ID } from '$wrappers/modal';

type Props = {
  isOpened: boolean;
  onRequestClose: () => void;
};

const Modal: React.FC<Props> = ({ isOpened, onRequestClose, children }) => {
  const [isVisible, setIsVisible] = useState<boolean>(isOpened);
  useEffect(
    function () {
      setIsVisible(isOpened);
    },
    [isOpened]
  );

  const handleBGClick = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  const handleCloseButtonClick = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  if (!isOpened) {
    return null;
  }

  return (
    <Portal targetId={ID}>
      <div className="absolute inset-0 pointer-events-auto">
        <div
          className={classnames(
            'absolute inset-0 transition-opacity duration-300',
            {
              'opacity-75': isVisible,
              'opacity-0': !isVisible,
            }
          )}
          onClick={handleBGClick}
        >
          <div className="absolute inset-0 bg-background" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={classnames(
              'min-w-25% max-w-75% min-h-25% max-h-75% flex flex-col pointer-events-auto transition duration-300 transform',
              {
                'scale-100': isVisible,
                'opacity-100': isVisible,
                'scale-110': !isVisible,
                'opacity-0': !isVisible,
              }
            )}
          >
            <div className="relative flex-none h-0">
              <div className="absolute right-0 bottom-0 left-0 flex justify-end">
                <button onClick={handleCloseButtonClick}>close</button>
              </div>
            </div>
            <div className="min-h-0 flex-1 bg-surface-04dp shadow-04dp p-4 rounded overflow-y-scroll overscroll-y-contain">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;

export const useModal = function (): {
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
  const open = function () {
    setIsOpened(true);
  };
  const close = function () {
    setIsOpened(false);
  };
  return {
    open,
    close,
    bind: {
      isOpened,
      onRequestClose: handleRequestClose,
    },
  };
};
