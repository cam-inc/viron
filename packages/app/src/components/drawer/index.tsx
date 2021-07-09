import classnames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import Portal from '$components/portal';
import { ID } from '$wrappers/drawer';

type Props = {
  isOpened: boolean;
  onRequestClose: () => void;
  position: 'left' | 'right';
};
const Drawer: React.FC<Props> = ({
  isOpened,
  onRequestClose,
  position,
  children,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(isOpened);
  useEffect(
    function () {
      setIsVisible(isOpened);
    },
    [isOpened]
  );

  const handleBGClick = useCallback(
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
      <div className="absolute inset-0 pointer-events-auto">
        <div
          className={classnames('absolute inset-0 transition duration-300', {
            'opacity-75': isVisible,
            'opacity-0': !isVisible,
          })}
          onClick={handleBGClick}
        >
          <div className="absolute inset-0 bg-background" />
        </div>
        <div
          className={classnames(
            'absolute inset-0 flex items-stretch justify-center pointer-events-none',
            {
              'flex-row-reverse': position === 'left',
            }
          )}
        >
          <div className="flex-none w-24" />
          <div
            className={classnames(
              'flex-1 w-0 bg-surface-04dp shadow-04dp overflow-y-scroll overscroll-y-contain pointer-events-auto transform transition duration-300',
              {
                'translate-x-0': isVisible,
                'opacity-100': isVisible,
                'translate-x-8': !isVisible && position === 'right',
                '-translate-x-8': !isVisible && position === 'left',
                'opacity-0': !isVisible,
              }
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};
export default Drawer;

export const useDrawer = function ({
  position = 'right',
}: {
  position?: Props['position'];
} = {}): {
  open: () => void;
  close: () => void;
  bind: {
    position: Props['position'];
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
      position,
      isOpened,
      onRequestClose: handleRequestClose,
    },
  };
};
