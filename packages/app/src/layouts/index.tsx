import { Splitter, SplitterPanel, SplitterResizeTrigger } from '@ark-ui/react';
import classNames from 'classnames';
import _ from 'lodash';
import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import ErrorBoundary from '~/components/errorBoundary';
import Drawer, { useDrawer } from '~/portals/drawer';
import { useAppScreenGlobalStateValue } from '~/store';
import { ClassName, COLOR_SYSTEM } from '~/types';

const HEIGHT_SYSTEM_BAR = 8;
const HEIGHT_APP_BAR = 48;

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

const Layout: React.FC<Props> = ({
  renderAppBar,
  renderNavigation,
  renderBody,
  renderSubBody,
}) => {
  const [isAppBarOpened, setIsAppBarOpened] = useState<boolean>(true);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  // Toggle app bar open status according to window.scrollY value.
  useEffect(() => {
    const bodyElement = bodyRef.current;
    if (!bodyElement) {
      return;
    }
    let isTicking = false;
    let prevScrollTop = bodyElement.scrollTop;
    const handleScroll = () => {
      if (isTicking) {
        return;
      }
      isTicking = true;
      window.requestAnimationFrame(() => {
        let isToOpen = false;
        const currentScrollTop = bodyElement.scrollTop;
        // to close when scrolled downward and to open when upward.
        if (prevScrollTop < currentScrollTop) {
          isToOpen = false;
        } else {
          isToOpen = true;
        }
        if (isToOpen) {
          setIsAppBarOpened(true);
        } else {
          // some amount of scroll required to close.
          const threshold = HEIGHT_APP_BAR;
          if (threshold < currentScrollTop) {
            setIsAppBarOpened(false);
          }
        }
        prevScrollTop = currentScrollTop;
        isTicking = false;
      });
    };
    const debouncedHandleScroll = _.debounce(handleScroll, 100);
    bodyElement.addEventListener('scroll', debouncedHandleScroll, {
      passive: true,
    });
    return function cleanup() {
      bodyElement.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, []);

  // Show navigation with drawer depending on screen size.
  const screen = useAppScreenGlobalStateValue();
  const { lg, height } = screen;
  const drawer = useDrawer({ position: 'left' });
  const { open, close } = drawer;
  const openNavigation = useCallback(() => {
    open();
  }, [open]);
  const closeNavigation = useCallback(() => {
    close();
  }, [close]);

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
            { id: 'body', size: 80, minSize: 10 },
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
                className="hover:bg-thm-on-secondary w-2 bg-thm-surface"
              />
            </>
          )}
          <SplitterPanel id="body">
            <Splitter
              orientation="vertical"
              defaultSize={[
                { id: 'appBarAndBody', size: 50, minSize: 10 },
                { id: 'subBody', size: 50 },
              ]}
            >
              <SplitterPanel id="appBarAndBody" className="relative">
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
                      className={classNames(
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
                  ref={bodyRef}
                  style={{
                    paddingTop: renderAppBar
                      ? `${HEIGHT_SYSTEM_BAR + HEIGHT_APP_BAR}px`
                      : `${HEIGHT_SYSTEM_BAR}px`,
                  }}
                  className={classNames(
                    'absolute inset-0 overflow-y-scroll overscroll-y-contain'
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
              </SplitterPanel>
              {/* region: Sub Body */}
              {renderSubBody && (
                <>
                  <SplitterResizeTrigger
                    id="appBarAndBody:subBody"
                    className="hover:bg-thm-on-secondary h-2 bg-thm-on-background-slight"
                  />
                  <SplitterPanel
                    id="subBody"
                    className="bg-thm-background text-thm-on-background shadow-01dp overflow-y-scroll overscroll-y-contain"
                  >
                    <ErrorBoundary on={COLOR_SYSTEM.BACKGROUND}>
                      {renderSubBody({
                        className: '',
                        style: {},
                        openNavigation,
                        closeNavigation,
                      })}
                    </ErrorBoundary>
                  </SplitterPanel>
                </>
              )}
            </Splitter>
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
