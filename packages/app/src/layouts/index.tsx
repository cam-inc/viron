import classnames from 'classnames';
import _ from 'lodash';
import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import ErrorBoundary from '~/components/errorBoundary';
import Drawer, { useDrawer } from '~/portals/drawer';
import { useAppScreenGlobalStateValue } from '~/store';
import { ClassName, COLOR_SYSTEM } from '~/types';

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
          // 64 = app bar height
          const threshold = 64;
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

  return (
    <>
      <div
        id="layout-index"
        className="bg-thm-background text-thm-on-background"
      >
        {/* region: System Bar */}
        <div className="fixed z-layout-systembar top-0 right-0 left-0 h-[8px] bg-thm-secondary text-thm-on-secondary shadow-01dp" />
        {/* region: App Bar */}
        {renderAppBar && (
          <div
            className={classnames(
              'fixed z-layout-appbar top-[8px] right-0 h-0',
              {
                'left-[160px]': renderNavigation && lg,
                'left-0': !(renderNavigation && lg),
              }
            )}
          >
            <div
              className={classnames(
                'h-[64px] bg-thm-primary text-thm-on-primary shadow-01dp transform transition duration-300 ease-out',
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
        {/* region: Navigation */}
        {renderNavigation && lg && (
          <div className="fixed z-layout-navigation top-[8px] left-0 bottom-0 w-[160px] bg-thm-surface text-thm-on-surface shadow-01dp border-r-2 border-thm-on-surface-faint overflow-y-scroll overscroll-y-contain">
            <ErrorBoundary on={COLOR_SYSTEM.SURFACE}>
              {renderNavigation({
                className: '',
                style: {},
                openNavigation,
                closeNavigation,
                isOnDrawer: false,
              })}
            </ErrorBoundary>
          </div>
        )}
        {/* region: Sub Body */}
        {renderSubBody && (
          <div
            className={classnames(
              'fixed z-layout-subbody right-0 bottom-0 h-[50vh] bg-thm-background text-thm-on-background shadow-01dp border-t-2 border-thm-on-background overflow-y-scroll overscroll-y-contain',
              {
                'left-[160px]': lg && renderNavigation,
                'left-0': !(lg && renderNavigation),
              }
            )}
          >
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
        {/* region: Body */}
        <div
          className={classnames('z-layout-body', {
            'pt-[8px]': !renderAppBar,
            'pt-[72px]': renderAppBar,
            'pl-[160px]': lg && renderNavigation,
            'pb-[50vh]': renderSubBody,
          })}
        >
          <ErrorBoundary on={COLOR_SYSTEM.BACKGROUND}>
            {renderBody({
              className: 'relative',
              style: {
                minHeight: `${height - (renderAppBar ? 72 : 8)}px`,
              },
              openNavigation,
              closeNavigation,
            })}
          </ErrorBoundary>
        </div>
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
