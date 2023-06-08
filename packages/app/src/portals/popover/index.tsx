import classnames from 'classnames';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Portal, { TARGET } from '~/portals';
import { useAppScreenGlobalStateValue } from '~/store';

// Which point of a target element a popover should be placed.
const PLACEMENT = {
  TOP_LEFT: 'TopLeft',
  TOP: 'Top',
  TOP_RIGHT: 'TopRight',
  BOTTOM_RIGHT: 'BottomRight',
  BOTTOM: 'Bottom',
  BOTTOM_LEFT: 'BottomLeft',
} as const;
type Placement = (typeof PLACEMENT)[keyof typeof PLACEMENT];

type Props = {
  isOpened: boolean;
  isHidden: boolean;
  onRequestClose: () => void;
  // Target element ref for a popover to be placed.
  targetRef: React.RefObject<HTMLElement>;
};

const Popover: React.FC<Props> = (props) => {
  const screen = useAppScreenGlobalStateValue();

  const { lg } = screen;
  if (lg) {
    return <PopoverLg {...props} />;
  } else {
    return <PopoverNotLg {...props} />;
  }
};
export default Popover;

const PopoverLg: React.FC<PropsWithChildren<Props>> = ({
  isOpened,
  isHidden,
  onRequestClose,
  targetRef,
  children,
}) => {
  const screen = useAppScreenGlobalStateValue();
  const [isVisible, setIsVisible] = useState<boolean>(isOpened);
  useEffect(() => {
    setIsVisible(isOpened);
  }, [isOpened]);

  // Auto closing.
  useEffect(() => {
    const handler = (e: Event) => {
      // Do nothing when the event has been dispatched from elements inside the target element.
      if (targetRef.current?.contains(e.target as Node)) {
        return;
      }
      onRequestClose();
    };
    window.addEventListener('click', handler);
    window.addEventListener('scroll', handler);
    const cleanup = () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('scroll', handler);
    };
    return cleanup;
  }, [targetRef, onRequestClose]);
  useEffect(() => {
    onRequestClose();
  }, [onRequestClose, screen.width, screen.height]);

  // Stop event propagation.
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Placement
  const placement = useMemo<Placement>(() => {
    const targetElement = targetRef.current;
    if (!targetElement) {
      return PLACEMENT.TOP;
    }
    const rect = targetElement.getBoundingClientRect();
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;
    const isVerticallyOnUpside = centerY <= screen.height / 2;
    const isVerticallyOnDownside = !isVerticallyOnUpside;
    const isHorizontallyOnLeft = centerX < screen.width / 3;
    const isHorizontallyOnCenter =
      screen.width / 3 <= centerX && centerX <= (screen.width / 3) * 2;
    const isHorizontallyOnRight = (screen.width / 3) * 2 < centerX;
    if (isHorizontallyOnLeft) {
      if (isVerticallyOnUpside) {
        return PLACEMENT.BOTTOM_LEFT;
      }
      if (isVerticallyOnDownside) {
        return PLACEMENT.TOP_LEFT;
      }
    }
    if (isHorizontallyOnCenter) {
      if (isVerticallyOnUpside) {
        return PLACEMENT.BOTTOM;
      }
      if (isVerticallyOnDownside) {
        return PLACEMENT.TOP;
      }
    }
    if (isHorizontallyOnRight) {
      if (isVerticallyOnUpside) {
        return PLACEMENT.BOTTOM_RIGHT;
      }
      if (isVerticallyOnDownside) {
        return PLACEMENT.TOP_RIGHT;
      }
    }
    return PLACEMENT.TOP;
  }, [targetRef, screen.width, screen.height, isOpened]);

  // Position
  type Position = { x: number; y: number };
  const position = useMemo<Position>(() => {
    const targetElement = targetRef.current;
    if (!targetElement) {
      return { x: 0, y: 0 } as Position;
    }

    if (isHidden) {
      return { x: 9999, y: 9999 } as Position;
    }
    const space = 8;
    const rect = targetElement.getBoundingClientRect();
    const position: Position = { x: 0, y: 0 };
    switch (placement) {
      case PLACEMENT.TOP_LEFT:
        position.x = rect.left;
        position.y = rect.top - space;
        break;
      case PLACEMENT.TOP:
        position.x = rect.x + rect.width / 2;
        position.y = rect.top - space;
        break;
      case PLACEMENT.TOP_RIGHT:
        position.x = rect.right;
        position.y = rect.top - space;
        break;
      case PLACEMENT.BOTTOM_RIGHT:
        position.x = rect.right;
        position.y = rect.bottom + space;
        break;
      case PLACEMENT.BOTTOM:
        position.x = rect.x + rect.width / 2;
        position.y = rect.bottom + space;
        break;
      case PLACEMENT.BOTTOM_LEFT:
        position.x = rect.left;
        position.y = rect.bottom + space;
        break;
    }
    return position;
  }, [targetRef, placement, isOpened, isHidden]);

  const content = useMemo<JSX.Element | null>(() => {
    const space = 8;
    const commonClassName =
      'p-2 rounded bg-thm-surface border border-thm-on-surface-low shadow-01dp overflow-scroll overscroll-contain';
    switch (placement) {
      case PLACEMENT.TOP_LEFT: {
        return (
          <div
            className={classnames('absolute', commonClassName)}
            style={{
              left: '0px',
              bottom: '0px',
              maxWidth: `${screen.width - position.x - space}px`,
              maxHeight: `${position.y - space}px`,
            }}
          >
            {children}
          </div>
        );
      }
      case PLACEMENT.TOP: {
        const baseWidth =
          Math.min(position.x, screen.width - position.x) - space;
        return (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${-baseWidth}px`,
              bottom: '0px',
              width: `${baseWidth * 2}px`,
            }}
          >
            <div className="flex justify-center">
              <div
                className={classnames(
                  'flex-none min-w-0 pointer-events-auto',
                  commonClassName
                )}
                style={{
                  maxWidth: `${baseWidth * 2}px`,
                  maxHeight: `${position.y - space}px`,
                }}
              >
                {children}
              </div>
            </div>
          </div>
        );
      }
      case PLACEMENT.TOP_RIGHT: {
        return (
          <div
            className={classnames('absolute', commonClassName)}
            style={{
              right: '0px',
              bottom: '0px',
              maxWidth: `${position.x - space}px`,
              maxHeight: `${position.y - space}px`,
            }}
          >
            {children}
          </div>
        );
      }
      case PLACEMENT.BOTTOM_RIGHT: {
        return (
          <div
            className={classnames('absolute', commonClassName)}
            style={{
              right: '0px',
              top: '0px',
              maxWidth: `${position.x - space}px`,
              maxHeight: `${screen.height - position.y - space}px`,
            }}
          >
            {children}
          </div>
        );
      }
      case PLACEMENT.BOTTOM: {
        const baseWidth =
          Math.min(position.x, screen.width - position.x) - space;
        return (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${-baseWidth}px`,
              top: '0px',
              width: `${baseWidth * 2}px`,
            }}
          >
            <div className="flex justify-center">
              <div
                className={classnames(
                  'flex-none min-w-0 pointer-events-auto',
                  commonClassName
                )}
                style={{
                  maxWidth: `${baseWidth * 2}px`,
                  maxHeight: `${screen.height - position.y - space}px`,
                }}
              >
                {children}
              </div>
            </div>
          </div>
        );
      }
      case PLACEMENT.BOTTOM_LEFT: {
        return (
          <div
            className={classnames('absolute', commonClassName)}
            style={{
              left: '0px',
              top: '0px',
              maxWidth: `${screen.width - position.x - space}px`,
              maxHeight: `${screen.height - position.y - space}px`,
            }}
          >
            {children}
          </div>
        );
      }
    }
  }, [placement, position, screen.width, screen.height, children]);

  if (!isOpened) {
    return null;
  }

  return (
    <Portal target={TARGET.POPOVER}>
      <div
        className={classnames(
          'absolute w-0 h-0 transform transition duration-100 origin-center pointer-events-auto',
          {
            'opacity-100 scale-100': isVisible,
            'opacity-0 scale-75': !isVisible,
          }
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onClick={handleClick}
      >
        {content}
      </div>
    </Portal>
  );
};
const PopoverNotLg: React.FC<PropsWithChildren<Props>> = ({
  isOpened,
  isHidden,
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

  if (!isOpened) {
    return null;
  }

  return (
    <Portal target={TARGET.POPOVER}>
      <div
        className={classnames('absolute inset-0 pointer-events-auto', {
          hidden: isHidden,
        })}
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
        <div className="absolute inset-0 flex flex-col pointer-events-none">
          <div className="flex-1" />
          <div
            className={classnames(
              'flex-none p-2 rounded-t bg-thm-surface shadow-05dp overflow-y-scroll overscroll-y-contain pointer-events-auto transform transition duration-300',
              {
                'opacity-100 translate-y-0': isVisible,
                'opacity-0 translate-y-8': !isVisible,
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

type UsePopoverReturn<T> = {
  open: () => void;
  close: () => void;
  hide: () => void;
  targetRef: React.RefObject<T>;
  bind: {
    isOpened: Props['isOpened'];
    isHidden: Props['isHidden'];
    onRequestClose: Props['onRequestClose'];
    targetRef: React.RefObject<T>;
  };
};
export const usePopover = function <
  T extends HTMLElement
>(): UsePopoverReturn<T> {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const handleRequestClose = useCallback(() => {
    setIsOpened(false);
  }, []);
  const open = useCallback(() => {
    setIsOpened(true);
    setIsHidden(false);
  }, []);
  const close = useCallback(() => {
    setIsOpened(false);
  }, []);
  const hide = useCallback(() => {
    setIsHidden(true);
  }, []);
  const targetRef = useRef<T>(null);

  const ret = useMemo<UsePopoverReturn<T>>(
    () => ({
      open,
      close,
      hide,
      targetRef,
      bind: {
        isOpened,
        isHidden,
        onRequestClose: handleRequestClose,
        targetRef,
      },
    }),
    [open, close, hide, isOpened, isHidden, handleRequestClose]
  );
  return ret;
};
