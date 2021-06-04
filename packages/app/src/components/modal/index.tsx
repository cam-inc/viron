import classnames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Portal from '$components/portal';
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
  const bgRef = useRef<HTMLDivElement>(null);
  const runAnimation = useCallback(
    function (reverse: boolean, onFinish?: () => void) {
      const bgElement = bgRef.current;
      if (!bgElement) {
        return;
      }
      const keyframes: Keyframe[] = [{ opacity: 0 }, { opacity: 0.5 }];
      const options: KeyframeEffectOptions = {
        duration: 300,
        fill: 'forwards',
      };
      bgElement.getAnimations().forEach((anim) => anim.cancel());
      const ke = new KeyframeEffect(bgElement, keyframes, {
        ...options,
        direction: reverse ? 'reverse' : 'normal',
      });
      const anim = new Animation(ke, document.timeline);
      const anims: Animation[] = [anim];
      Promise.all(anims.map((anim) => anim.ready)).then((anims) => {
        anims.forEach((anim) => anim.play());
      });
      Promise.all(anims.map((anim) => anim.finished)).then(() => {
        onFinish?.();
      });
    },
    [bgRef.current]
  );

  const [isVisible, setIsVisible] = useState(isOpened);
  useEffect(() => {
    setIsVisible(isOpened);
    runAnimation(!isOpened);
  }, [isOpened, runAnimation]);

  const requestClose = useCallback(() => {
    const accept = async (handleInvisible: () => void): Promise<void> => {
      setIsVisible(false);
      runAnimation(true, function () {
        handleInvisible();
      });
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
          className={classnames('absolute inset-0 bg-black')}
          ref={bgRef}
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
    // this function will be overwrriten.
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
