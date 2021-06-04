import classnames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Portal from '$components/portal';
import { wait } from '$utils/index';
import { ID } from '$wrappers/modal';

type Props = {
  isOpened: boolean;
  requestCloseRef: React.MutableRefObject<() => void>;
  onRequestClose: (
    accept: (handleInvisible: () => void) => Promise<void>
  ) => void;
  autoClose: boolean;
};

const Modal: React.FC<Props> = ({
  isOpened,
  requestCloseRef,
  onRequestClose,
  autoClose,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(isOpened);
  useEffect(() => {
    setIsVisible(isOpened);
  }, [isOpened]);

  const requestClose = useCallback(() => {
    const accept = async (handleInvisible: () => void): Promise<void> => {
      setIsVisible(false);
      // TODO: use web animation api.
      await wait(300);
      handleInvisible();
    };
    onRequestClose(accept);
  }, [onRequestClose]);

  useEffect(
    function () {
      requestCloseRef.current = function () {
        requestClose();
      };
    },
    [requestCloseRef, requestCloseRef.current, requestClose]
  );

  const handleBGClick = useCallback(() => {
    if (!autoClose) {
      return;
    }
    requestClose();
  }, [autoClose, requestClose]);

  const handleCloseClick = useCallback(() => {
    requestClose();
  }, [requestClose]);

  if (!isOpened) {
    return null;
  }

  return (
    <Portal targetId={ID}>
      <div
        className={classnames('absolute inset-0', {
          'pointer-events-none': !isVisible,
          'pointer-events-auto': isVisible,
        })}
      >
        <div
          className={classnames(
            'absolute inset-0 bg-black transition-opacity duration-300 ease-in-out',
            {
              'opacity-0': !isVisible,
              'opacity-50': isVisible,
            }
          )}
          onClick={handleBGClick}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={classnames(
              'min-w-25% max-w-75%  min-h-25% max-h-75% flex flex-col transform transition duration-300 ease-in-out',
              {
                'pointer-events-none': !isVisible,
                'pointer-events-auto': isVisible,
                'opacity-0': !isVisible,
                'opacity-100': isVisible,
                'scale-105': !isVisible,
                'scale-100': isVisible,
              }
            )}
          >
            <div className="relative flex-shrink-0 flex-grow-0 h-0">
              <div className="absolute right-0 bottom-0 left-0 flex justify-end">
                <button onClick={handleCloseClick}>close</button>
              </div>
            </div>
            <div className="min-h-0 flex-grow flex-shrink bg-white p-4 rounded overflow-y-scroll overscroll-y-contain">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;

export const useModal = function ({
  autoClose = true,
}: {
  autoClose?: Props['autoClose'];
} = {}): {
  open: () => void;
  requestClose: () => void;
  bind: {
    isOpened: boolean;
    autoClose: Props['autoClose'];
    onRequestClose: Props['onRequestClose'];
    requestCloseRef: Props['requestCloseRef'];
  };
} {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const requestCloseRef = useRef<() => void>(function () {
    console.log('this function will be overwrriten.');
  });
  const handleRequestClose = useCallback(function (accept) {
    accept(() => {
      setIsOpened(false);
    });
  }, []);
  const open = function () {
    setIsOpened(true);
  };
  const requestClose = function () {
    requestCloseRef.current();
  };
  return {
    open,
    requestClose,
    bind: {
      isOpened,
      autoClose,
      onRequestClose: handleRequestClose,
      requestCloseRef,
    },
  };
};
