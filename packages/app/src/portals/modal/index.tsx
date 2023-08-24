import classnames from 'classnames';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import IconButton from '~/components/button/icon';
import CloseIcon from '~/components/icon/close/fill';
import Portal, { TARGET } from '~/portals';
import { COLOR_SYSTEM } from '~/types';

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
      <div className="absolute inset-0 pointer-events-auto">
        <div
          className={classnames(
            'absolute inset-0 transition-opacity duration-300 bg-thm-on-background',
            {
              'opacity-70': isVisible,
              'opacity-0': !isVisible,
            }
          )}
          onClick={handleBGClick}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={classnames(
              'min-w-50% max-w-75% max-h-75% flex flex-col pointer-events-auto transition duration-300 transform',
              {
                'scale-10 opacity-100': isVisible,
                'scale-110 opacity-0': !isVisible,
              }
            )}
          >
            <div className="relative min-h-0 flex-1 bg-thm-surface shadow-01dp border border-thm-on-surface-faint px-8 pt-8 pb-10 rounded-2xl overflow-y-scroll overscroll-y-contain">
              <div className="absolute top-2 right-2">
                <IconButton
                  on={COLOR_SYSTEM.BACKGROUND}
                  type="button"
                  onClick={handleCloseButtonClick}
                >
                  <CloseIcon />
                </IconButton>
              </div>
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
