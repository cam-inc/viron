import classnames from 'classnames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Portal from '$components/portal';
import { ID } from '$wrappers/popover';

type Props = {
  isOpened: boolean;
  requestCloseRef: React.MutableRefObject<() => void>;
  onRequestClose: (
    accept: (handleInvisible: () => void) => Promise<void>
  ) => void;
  // Target element ref for a popover to be placed.
  targetRef: React.RefObject<HTMLElement>;
  // Which point of a target element a popover should be placed.
  placement:
    | 'TL'
    | 'Top'
    | 'TR'
    | 'RT'
    | 'Right'
    | 'RB'
    | 'BR'
    | 'Bottom'
    | 'BL'
    | 'LB'
    | 'Left'
    | 'LT';
};

const Popover: React.FC<Props> = ({
  isOpened,
  requestCloseRef,
  onRequestClose,
  targetRef,
  placement,
  children,
}) => {
  type Position = { x: number; y: number };
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [rect, setRect] = useState<DOMRect>(new DOMRect());

  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const runAnimation = useCallback(
    async function (reverse: boolean) {
      if (!targetRef.current) {
        return;
      }
      if (!containerRef.current || !innerRef.current) {
        return;
      }
      // Calculate position.
      const space = 4;
      const position: { x: number; y: number } = { x: 0, y: 0 };
      const targetElement = targetRef.current;
      const rect = targetElement.getBoundingClientRect();

      switch (placement) {
        case 'TL':
          position.x = rect.x + space;
          position.y = rect.y - space;
          break;
        case 'Top':
          position.x = rect.x + rect.width / 2;
          position.y = rect.y - space;
          break;
        case 'TR':
          position.x = rect.x + rect.width - space;
          position.y = rect.y - space;
          break;
        case 'RT':
          position.x = rect.x + rect.width + space;
          position.y = rect.y + space;
          break;
        case 'Right':
          position.x = rect.x + rect.width + space;
          position.y = rect.y + rect.height / 2;
          break;
        case 'RB':
          position.x = rect.x + rect.width + space;
          position.y = rect.y + rect.height - space;
          break;
        case 'BR':
          position.x = rect.x + rect.width - space;
          position.y = rect.y + rect.height + space;
          break;
        case 'Bottom':
          position.x = rect.x + rect.width / 2;
          position.y = rect.y + rect.height + space;
          break;
        case 'BL':
          position.x = rect.x + space;
          position.y = rect.y + rect.height + space;
          break;
        case 'LB':
          position.x = rect.x - space;
          position.y = rect.y + rect.height - space;
          break;
        case 'Left':
          position.x = rect.x - space;
          position.y = rect.y + rect.height / 2;
          break;
        case 'LT':
          position.x = rect.x - space;
          position.y = rect.y + space;
          break;
      }
      setPosition(position);
      setRect(rect);

      // Animation settings.
      const duration = 100;
      const animContainer = new Animation(
        new KeyframeEffect(
          containerRef.current,
          [
            {
              pointerEvents: 'none',
              opacity: 0,
              transform: `translate(${position.x}px, ${position.y}px)`,
            },
            {
              pointerEvents: 'auto',
              opacity: 1,
              transform: `translate(${position.x}px, ${position.y}px)`,
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
      const animInner = new Animation(
        new KeyframeEffect(
          innerRef.current,
          [{ transform: `scale(0.8)` }, { transform: `scale(1)` }],
          {
            duration,
            fill: 'forwards',
            direction: reverse ? 'reverse' : 'normal',
          }
        ),
        document.timeline
      );
      const anims: Animation[] = [animContainer, animInner];

      // Run
      const animsReady = await Promise.all(
        anims.map(function (anim) {
          return anim.ready;
        })
      );
      animsReady.forEach(function (anim) {
        anim.play();
      });
      await Promise.all(
        anims.map(function (anim) {
          return anim.finished;
        })
      );
    },
    [targetRef, containerRef, innerRef, placement]
  );

  useEffect(
    function () {
      runAnimation(!isOpened);
    },
    [isOpened, runAnimation]
  );

  const requestClose = useCallback(
    function () {
      if (!isOpened) {
        return;
      }
      const accept = async (handleInvisible: () => void): Promise<void> => {
        await runAnimation(true);
        handleInvisible();
      };
      onRequestClose(accept);
    },
    [onRequestClose, isOpened]
  );

  useEffect(
    function () {
      requestCloseRef.current = function () {
        requestClose();
      };
    },
    [requestCloseRef, requestCloseRef.current, requestClose]
  );

  const content = useMemo<JSX.Element>(
    function () {
      const triangleW = 40;
      const triangleH = 30;
      const Trianle: React.FC<{ style: React.CSSProperties }> = function ({
        style,
      }) {
        return <div className="absolute w-0 h-0 border-solid" style={style} />;
      };
      const triangleTop = (
        <Trianle
          style={{
            top: '0',
            left: `-${triangleW / 2}px`,
            borderWidth: `0 ${triangleW / 2}px ${triangleH}px ${
              triangleW / 2
            }px`,
            borderColor: 'transparent transparent red transparent',
          }}
        />
      );
      const triangleRight = (
        <Trianle
          style={{
            right: '0',
            bottom: `-${triangleW / 2}px`,
            borderWidth: `${triangleW / 2}px 0 ${
              triangleW / 2
            }px ${triangleH}px`,
            borderColor: 'transparent transparent transparent red',
          }}
        />
      );
      const triangleBottom = (
        <Trianle
          style={{
            bottom: '0',
            left: `-${triangleW / 2}px`,
            borderWidth: `${triangleH}px ${triangleW / 2}px 0 ${
              triangleW / 2
            }px`,
            borderColor: 'red transparent transparent transparent',
          }}
        />
      );
      const triangleLeft = (
        <Trianle
          style={{
            left: '0',
            bottom: `-${triangleW / 2}px`,
            borderWidth: `${triangleW / 2}px ${triangleH}px ${
              triangleW / 2
            }px 0`,
            borderColor: 'transparent red transparent transparent',
          }}
        />
      );
      switch (placement) {
        case 'TL':
        case 'Top':
        case 'TR':
          return (
            <>
              {triangleBottom}
              <div
                className="absolute w-0"
                style={{
                  bottom: `${triangleH}px`,
                  left: `0px`,
                }}
              >
                <div
                  className="flex justify-center pointer-events-none"
                  style={{
                    width: '200vw',
                    transform: 'translateX(-100vw)',
                  }}
                >
                  <div className="p-2 bg-red-500 pointer-events-auto">
                    {children}
                  </div>
                </div>
              </div>
            </>
          );
        case 'RT':
        case 'Right':
        case 'RB':
          return (
            <>
              {triangleLeft}
              <div
                className="absolute h-0"
                style={{
                  bottom: `0`,
                  left: `${triangleH}px`,
                }}
              >
                <div
                  className="flex flex-col justify-center pointer-events-none"
                  style={{
                    height: '200vh',
                    transform: 'translateY(-100vh)',
                  }}
                >
                  <div className="p-2 bg-red-500 pointer-events-auto">
                    {children}
                  </div>
                </div>
              </div>
            </>
          );
        case 'BR':
        case 'Bottom':
        case 'BL':
          return (
            <>
              {triangleTop}
              <div
                className="absolute w-0"
                style={{
                  top: `${triangleH}px`,
                  left: `0px`,
                }}
              >
                <div
                  className="flex justify-center pointer-events-none"
                  style={{
                    width: '200vw',
                    transform: 'translateX(-100vw)',
                  }}
                >
                  <div className="p-2 bg-red-500 pointer-events-auto">
                    {children}
                  </div>
                </div>
              </div>
            </>
          );
        case 'LB':
        case 'Left':
        case 'LT':
          return (
            <>
              {triangleRight}
              <div
                className="absolute h-0"
                style={{
                  bottom: `0`,
                  right: `${triangleH}px`,
                }}
              >
                <div
                  className="flex flex-col justify-center pointer-events-none"
                  style={{
                    height: '200vh',
                    transform: 'translateY(-100vh)',
                  }}
                >
                  <div className="p-2 bg-red-500 pointer-events-auto">
                    {children}
                  </div>
                </div>
              </div>
            </>
          );
      }
    },
    [placement, position, rect, children]
  );

  useEffect(
    function () {
      const cleanup = function () {
        window.removeEventListener('click', handler);
        window.removeEventListener('scroll', handler);
      };
      const handler = function () {
        cleanup();
        requestClose();
      };
      window.addEventListener('click', handler);
      window.addEventListener('scroll', handler);
      return cleanup;
    },
    [requestClose]
  );

  if (!isOpened) {
    return null;
  }

  return (
    <Portal targetId={ID}>
      <div className="absolute w-0 h-0" ref={containerRef}>
        <div className="relative w-0 h-0 origin-center" ref={innerRef}>
          {content}
        </div>
      </div>
    </Portal>
  );
};
export default Popover;

export const usePopover = function <T extends HTMLElement>({
  placement = 'Top',
}: { placement?: Props['placement'] } = {}): {
  open: () => void;
  requestClose: () => void;
  targetRef: React.RefObject<T>;
  bind: {
    isOpened: boolean;
    onRequestClose: Props['onRequestClose'];
    requestCloseRef: Props['requestCloseRef'];
    targetRef: React.RefObject<T>;
    placement: Props['placement'];
  };
} {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const requestCloseRef = useRef<() => void>(function () {
    // this function will be overwrriten.
  });
  const targetRef = useRef<T>(null);
  const handleRequestClose = useCallback(function (accept) {
    accept(function () {
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
    targetRef,
    bind: {
      isOpened,
      onRequestClose: handleRequestClose,
      requestCloseRef,
      targetRef,
      placement,
    },
  };
};
