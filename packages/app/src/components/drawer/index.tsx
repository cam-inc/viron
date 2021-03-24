import classnames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import Portal from '$components/portal';
import { timeout } from '$utils/index';
import { id } from '$wrappers/drawer';

type Props = {
  isOpened: boolean;
  onRequestClose?: (
    accept: (handleInvisible: () => void) => Promise<void>
  ) => void;
  autoClose?: boolean;
};
const Drawer: React.FC<Props> = ({
  isOpened = false,
  onRequestClose,
  autoClose = true,
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
      await timeout(300);
      handleInvisible();
    };
    onRequestClose && onRequestClose(accept);
  }, [onRequestClose]);

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
    <Portal targetId={id}>
      <div
        className={classnames('absolute inset-0', {
          'pointer-events-none': !isVisible,
        })}
      >
        <div
          className={classnames(
            'absolute inset-0 bg-black transition-opacity duration-300 ease-in-out pointer-events-auto',
            {
              'opacity-0': !isVisible,
              'opacity-50': isVisible,
            }
          )}
          onClick={handleBGClick}
        />
        <div
          className={classnames(
            'absolute inset-0 flex items-stretch justify-end transform transition duration-300 ease-in-out',
            {
              'opacity-0': !isVisible,
              'opacity-100': isVisible,
              'translate-x-4': !isVisible,
              'translate-x-0': isVisible,
            }
          )}
        >
          <div className="relative flex-shrink-0 flex-grow-0 w-24">
            <div
              className={classnames(
                'absolute right-0 top-0 left-0 flex justify-end',
                {
                  'pointer-events-none': !isVisible,
                  'pointer-events-auto': isVisible,
                }
              )}
            >
              <button onClick={handleCloseClick}>close</button>
            </div>
          </div>
          <div
            className={classnames(
              'min-w-0 flex-grow flex-shrink bg-white p-4 overflow-y-scroll overscroll-y-contain',
              {
                'pointer-events-none': !isVisible,
                'pointer-events-auto': isVisible,
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
