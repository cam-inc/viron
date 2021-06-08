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
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const runAnimation = useCallback(
    function (reverse: boolean, onFinish?: () => void) {
      if (!containerRef.current || !bgRef.current || !frameRef.current) {
        return;
      }
      // Reset all animations first.
      containerRef.current.getAnimations().forEach((anim) => anim.cancel());
      bgRef.current.getAnimations().forEach((anim) => anim.cancel());
      frameRef.current.getAnimations().forEach((anim) => anim.cancel());

      // Animation settings.
      const duration = 300;
      const animContainer = new Animation(
        new KeyframeEffect(
          containerRef.current,
          [{ pointerEvents: 'none' }, { pointerEvents: 'auto' }],
          {
            duration,
            fill: 'forwards',
            direction: reverse ? 'reverse' : 'normal',
          }
        ),
        document.timeline
      );
      const animBg = new Animation(
        new KeyframeEffect(bgRef.current, [{ opacity: 0 }, { opacity: 0.5 }], {
          duration,
          fill: 'forwards',
          direction: reverse ? 'reverse' : 'normal',
        }),
        document.timeline
      );
      const animFrame = new Animation(
        new KeyframeEffect(
          frameRef.current,
          [
            {
              pointerEvents: 'none',
              opacity: 0,
              transform: 'scale(1.05)',
            },
            {
              pointerEvents: 'auto',
              opacity: 1,
              transform: 'scale(1)',
            },
          ],
          {
            duration,
            fill: 'forwards',
            direction: reverse ? 'reverse' : 'normal',
          }
        ),
        document.timeline
      );
      const anims: Animation[] = [animContainer, animBg, animFrame];

      // Run
      Promise.all(anims.map((anim) => anim.ready)).then((anims) => {
        anims.forEach((anim) => anim.play());
      });
      Promise.all(anims.map((anim) => anim.finished)).then(() => {
        onFinish?.();
      });
    },
    [containerRef, bgRef, frameRef]
  );

  useEffect(() => {
    runAnimation(!isOpened);
  }, [isOpened, runAnimation]);

  const requestClose = useCallback(() => {
    const accept = async (handleInvisible: () => void): Promise<void> => {
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
      <div className="absolute inset-0" ref={containerRef}>
        <div
          className={classnames('absolute inset-0 bg-black')}
          ref={bgRef}
          onClick={handleBGClick}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="min-w-25% max-w-75%  min-h-25% max-h-75% flex flex-col"
            ref={frameRef}
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
