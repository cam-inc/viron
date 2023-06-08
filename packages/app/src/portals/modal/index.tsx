import classnames from 'classnames';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import XCircleIcon from '~/components/icon/xCircle/outline';
import Portal, { TARGET } from '~/portals';

type Props = {
  isOpened: boolean;
  onRequestClose: () => void;
};

const Modal: React.FC<PropsWithChildren<Props>> = ({
  isOpened,
  onRequestClose,
  children,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(isOpened);
  useEffect(() => {
    setIsVisible(isOpened);
  }, [isOpened]);

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
    <Portal target={TARGET.MODAL}>
      <div className="absolute inset-0 pointer-events-auto backdrop-filter backdrop-blur-sm">
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
          <div className="absolute inset-0 bg-thm-background" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={classnames(
              'min-w-50% max-w-75% max-h-75% flex flex-col pointer-events-auto transition duration-300 transform',
              {
                'scale-100': isVisible,
                'opacity-100': isVisible,
                'scale-110': !isVisible,
                'opacity-0': !isVisible,
              }
            )}
          >
            <div className="relative flex-none h-0">
              <div className="absolute right-0 bottom-[8px] left-0 flex justify-end">
                <button onClick={handleCloseButtonClick}>
                  <XCircleIcon className="text-lg text-thm-on-background" />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 bg-thm-surface shadow-01dp border border-thm-on-surface-faint p-4 rounded overflow-y-scroll overscroll-y-contain">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;

type UseModalReturn = {
  open: () => void;
  close: () => void;
  bind: {
    isOpened: boolean;
    onRequestClose: Props['onRequestClose'];
  };
};
export const useModal = (): UseModalReturn => {
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

  const ret = useMemo<UseModalReturn>(
    () => ({
      open,
      close,
      bind: {
        isOpened,
        onRequestClose: handleRequestClose,
      },
    }),
    [open, close, isOpened, handleRequestClose]
  );
  return ret;
};
