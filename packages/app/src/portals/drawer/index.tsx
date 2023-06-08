import classnames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Portal, { TARGET } from '~/portals';

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
  useEffect(() => {
    setIsVisible(isOpened);
  }, [isOpened]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.stopPropagation();
    },
    []
  );

  const handleBGClick = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  if (!isOpened) {
    return null;
  }

  return (
    <Portal target={TARGET.DRAWER}>
      <div
        className="absolute inset-0 pointer-events-auto"
        onClick={handleClick}
      >
        <div
          className={classnames(
            'absolute inset-0 transition duration-300 backdrop-filter backdrop-blur-sm',
            {
              'opacity-75': isVisible,
              'opacity-0': !isVisible,
            }
          )}
          onClick={handleBGClick}
        >
          <div className="absolute inset-0 bg-thm-background" />
        </div>
        <div
          className={classnames(
            'absolute inset-0 flex items-stretch justify-center pointer-events-none',
            {
              'flex-row-reverse': position === 'left',
            }
          )}
        >
          <div className="flex-1 w-24" style={{ flexGrow: 1 }} />
          <div
            className={classnames(
              'flex-auto w-[240px] max-w-[960px] bg-thm-surface shadow-04dp overflow-y-scroll overscroll-y-contain pointer-events-auto transform transition duration-300',
              {
                'translate-x-0': isVisible,
                'opacity-100': isVisible,
                'translate-x-8': !isVisible && position === 'right',
                '-translate-x-8': !isVisible && position === 'left',
                'opacity-0': !isVisible,
              }
            )}
            style={{ flexGrow: 3 }}
          >
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};
export default Drawer;

type UseDrawerReturn = {
  open: () => void;
  close: () => void;
  bind: {
    position: Props['position'];
    isOpened: boolean;
    onRequestClose: Props['onRequestClose'];
  };
};
export const useDrawer = ({
  position = 'right',
}: {
  position?: Props['position'];
} = {}): UseDrawerReturn => {
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

  const ret = useMemo<UseDrawerReturn>(
    () => ({
      open,
      close,
      bind: {
        position,
        isOpened,
        onRequestClose: handleRequestClose,
      },
    }),
    [open, close, position, isOpened, handleRequestClose]
  );
  return ret;
};
