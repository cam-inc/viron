import { Splitter, SplitterPanel, SplitterResizeTrigger } from '@ark-ui/react';
import classNames from 'classnames';
import classnames from 'classnames';
import _ from 'lodash';
import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import ErrorBoundary from '~/components/errorBoundary';
import Drawer, { useDrawer } from '~/portals/drawer';
import { useAppScreenGlobalStateValue } from '~/store';
import { ClassName, COLOR_SYSTEM } from '~/types';

const HEIGHT_SYSTEM_BAR = 8;
const HEIGHT_APP_BAR = 48;
const WIDTH_NAVIGATION = 260;

export type Props = {
  renderAppBar?: (args: {
    className: ClassName;
    style: CSSProperties;
    openNavigation: () => void;
    closeNavigation: () => void;
  }) => JSX.Element | null;
  renderNavigation?: (args: {
    className: ClassName;
    style: CSSProperties;
    openNavigation: () => void;
    closeNavigation: () => void;
    isOnDrawer: boolean;
  }) => JSX.Element | null;
  renderBody: (args: {
    className: ClassName;
    style: CSSProperties;
    openNavigation: () => void;
    closeNavigation: () => void;
    minHeight: number;
  }) => JSX.Element | null;
  renderSubBody?: (args: {
    className: ClassName;
    style: CSSProperties;
    openNavigation: () => void;
    closeNavigation: () => void;
  }) => JSX.Element | null;
};

// const Events = () => (
//   <Splitter
//     defaultSize={[
//       { id: 'a', size: 50 },
//       { id: 'b', size: 50 },
//     ]}
//     onResizeStart={(details) => console.log('onResizeStart', details)}
//     onResizeEnd={(details) => console.log('onResizeEnd', details)}
//   >
//     <SplitterPanel id="a">A</SplitterPanel>
//     <SplitterResizeTrigger id="a:b" />
//     <SplitterPanel id="b">B</SplitterPanel>
//   </Splitter>
// );
const Layout: React.FC<Props> = ({
  renderAppBar,
  renderNavigation,
  renderBody,
  renderSubBody,
}) => {
  const [isAppBarOpened, setIsAppBarOpened] = useState<boolean>(true);
  // Toggle app bar open status according to window.scrollY value.
  useEffect(() => {
    let isTicking = false;
    let prevScrollY = window.scrollY;
    const handleScroll = () => {
      if (isTicking) {
        return;
      }
      isTicking = true;
      window.requestAnimationFrame(() => {
        let isToOpen = false;
        const currentScrollY = window.scrollY;
        // to close when scrolled downward and to open when upward.
        if (prevScrollY < currentScrollY) {
          isToOpen = false;
        } else {
          isToOpen = true;
        }
        if (isToOpen) {
          setIsAppBarOpened(true);
        } else {
          // some amount of scroll required to close.
          const threshold = HEIGHT_APP_BAR;
          if (threshold < currentScrollY) {
            setIsAppBarOpened(false);
          }
        }
        prevScrollY = currentScrollY;
        isTicking = false;
      });
    };
    const debouncedHandleScroll = _.debounce(handleScroll, 100);
    document.addEventListener('scroll', debouncedHandleScroll, {
      passive: true,
    });
    return function cleanup() {
      document.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, []);

  // Show navigation with drawer depending on screen size.
  const screen = useAppScreenGlobalStateValue();
  const { lg, height } = screen;
  const drawer = useDrawer({ position: 'left' });
  const openNavigation = useCallback(() => {
    drawer.open();
  }, [drawer.open]);
  const closeNavigation = useCallback(() => {
    drawer.close();
  }, [drawer.close]);

  const HIDE = false;

  return (
    <>
      <div
        id="layout-index"
        className="bg-thm-background text-thm-on-background"
      >
        {/* region: System Bar */}
        <div
          style={{
            height: `${HEIGHT_SYSTEM_BAR}px`,
          }}
          className="fixed z-layout-systembar top-0 right-0 left-0 bg-thm-secondary text-thm-on-secondary shadow-01dp"
        />
        <Splitter
          defaultSize={[
            { id: 'navigation', size: 20 },
            { id: 'body', size: 80 },
          ]}
        >
          {/* region: Navigation */}
          {renderNavigation && lg && (
            <>
              <SplitterPanel
                id="navigation"
                style={{ paddingTop: `${HEIGHT_SYSTEM_BAR}px` }}
                className="h-screen bg-thm-surface text-thm-on-surface border-r-1 border-thm-on-surface-faint overflow-y-scroll overscroll-y-contain"
              >
                <ErrorBoundary on={COLOR_SYSTEM.SURFACE}>
                  {renderNavigation({
                    className: '',
                    style: {},
                    openNavigation,
                    closeNavigation,
                    isOnDrawer: false,
                  })}
                </ErrorBoundary>
              </SplitterPanel>
              <SplitterResizeTrigger
                id="navigation:body"
                className="hover:bg-thm-on-secondary w-2"
              />
            </>
          )}
          <SplitterPanel id="body" className="">
            {/* region: App Bar */}
            {renderAppBar && (
              <div
                style={{
                  top: `${HEIGHT_SYSTEM_BAR}px`,
                }}
                className="fixed z-layout-appbar h-0 w-full"
              >
                <div
                  style={{
                    height: `${HEIGHT_APP_BAR}px`,
                  }}
                  className={classnames(
                    'text-thm-on-primary transform transition duration-300 ease-out',
                    {
                      'pointer-events-none': !isAppBarOpened,
                      'opacity-0': !isAppBarOpened,
                      '-translate-y-4': !isAppBarOpened,
                    }
                  )}
                >
                  <ErrorBoundary on={COLOR_SYSTEM.PRIMARY}>
                    {renderAppBar({
                      className:
                        'h-full overflow-x-auto overscroll-x-contain overflow-y-hidden',
                      style: {},
                      openNavigation,
                      closeNavigation,
                    })}
                  </ErrorBoundary>
                </div>
              </div>
            )}
            {/* region: Body */}
            <div
              style={{
                paddingTop: renderAppBar
                  ? `${HEIGHT_SYSTEM_BAR + HEIGHT_APP_BAR}px`
                  : `${HEIGHT_SYSTEM_BAR}px`,
              }}
              className={classNames(
                'pb-10 overflow-y-scroll overscroll-y-contain',
                {
                  'h-screen': !renderSubBody,
                  'h-[50vh]': renderSubBody,
                }
              )}
            >
              <ErrorBoundary on={COLOR_SYSTEM.BACKGROUND}>
                {renderBody({
                  className: 'relative',
                  style: {
                    minHeight: `${
                      height -
                      (renderAppBar
                        ? HEIGHT_SYSTEM_BAR + HEIGHT_APP_BAR
                        : HEIGHT_SYSTEM_BAR)
                    }px`,
                  },
                  openNavigation,
                  closeNavigation,
                  minHeight:
                    height -
                    (renderAppBar
                      ? HEIGHT_SYSTEM_BAR + HEIGHT_APP_BAR
                      : HEIGHT_SYSTEM_BAR),
                })}
              </ErrorBoundary>
            </div>
            {/* region: Sub Body */}
            {renderSubBody && (
              <div className="h-[50vh] bg-thm-background text-thm-on-background shadow-01dp border-t-2 border-thm-on-background-slight overflow-y-scroll overscroll-y-contain">
                <ErrorBoundary on={COLOR_SYSTEM.BACKGROUND}>
                  {renderSubBody({
                    className: '',
                    style: {},
                    openNavigation,
                    closeNavigation,
                  })}
                </ErrorBoundary>
              </div>
            )}
          </SplitterPanel>
        </Splitter>
      </div>
      {renderNavigation && (
        <Drawer {...drawer.bind}>
          <ErrorBoundary on={COLOR_SYSTEM.SURFACE}>
            {renderNavigation({
              className: '',
              style: {},
              openNavigation,
              closeNavigation,
              isOnDrawer: true,
            })}
          </ErrorBoundary>
        </Drawer>
      )}
    </>
  );
};

export default Layout;
