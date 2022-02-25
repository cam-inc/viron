import classnames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Portal, { TARGET } from '~/portals';

type Props = {
  isOpened: boolean;
  onRequestClose: () => void;
};
const Progress: React.FC<Props> = ({ isOpened, onRequestClose, children }) => {
  const [isVisible, setIsVisible] = useState<boolean>(isOpened);
  useEffect(() => {
    setIsVisible(isOpened);
  }, [isOpened]);

  const handleClick = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  if (!isOpened) {
    return null;
  }

  return (
    <Portal target={TARGET.PROGRESS}>
      <div
        className={classnames(
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

type UseProgressReturn = {
  open: () => void;
  close: () => void;
  bind: {
    isOpened: boolean;
    onRequestClose: Props['onRequestClose'];
  };
};
export const useProgress = (): UseProgressReturn => {
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

  const ret = useMemo<UseProgressReturn>(
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
