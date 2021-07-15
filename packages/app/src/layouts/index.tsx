import classnames from 'classnames';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import Drawer, { useDrawer } from '$components/drawer';
import { screenState } from '$store/atoms/app';

export type Props = {
  renderAppBar?: (args: {
    className: string;
    openNavigation: () => void;
    closeNavigation: () => void;
  }) => JSX.Element | null;
  renderNavigation?: (args: {
    className: string;
    openNavigation: () => void;
    closeNavigation: () => void;
    isOnDrawer: boolean;
  }) => JSX.Element | null;
  renderBody: (args: {
    className: string;
    openNavigation: () => void;
    closeNavigation: () => void;
  }) => JSX.Element | null;
  renderSubBody?: (args: {
    className: string;
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
  useEffect(function () {
    let isTicking = false;
    let prevScrollY = window.scrollY;
    const handleScroll = function () {
      if (isTicking) {
        return;
      }
      isTicking = true;
      window.requestAnimationFrame(function () {
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
  const [screen] = useRecoilState(screenState);
  const { lg } = screen;
  const drawer = useDrawer({ position: 'left' });
  const openNavigation = useCallback(
    function () {
      drawer.open();
    },
    [drawer]
  );
  const closeNavigation = useCallback(
    function () {
      drawer.close();
    },
    [drawer]
  );

  return (
    <>
      <div
        id="layout-index"
        className="relative flex flex-col min-h-screen bg-background"
      >
        {/* System Bar */}
        <div className="fixed z-layout-systembar top-0 right-0 left-0 h-[8px] bg-primary-variant shadow-01dp" />
        {/* region: App Bar */}
        {renderAppBar && (
          <div
            className={classnames(
              'fixed z-layout-appbar top-[8px] right-0 h-0',
              {
                'left-[160px]': lg,
                'left-0': !lg,
              }
            )}
          >
            <div
              className={classnames(
                'h-[64px] bg-primary shadow-01dp transform transition duration-300 ease-out',
                {
                  'pointer-events-none': !isAppBarOpened,
                  'opacity-0': !isAppBarOpened,
                  '-translate-y-4': !isAppBarOpened,
                }
              )}
            >
              {renderAppBar({
                className: 'h-full',
                openNavigation,
                closeNavigation,
              })}
            </div>
          </div>
        )}
        {/* region: Navigation */}
        {renderNavigation && lg && (
          <div className="fixed z-layout-navigation top-[8px] left-0 bottom-0 w-[160px] bg-surface shadow-01dp border-r border-on-surface-faint overflow-y-scroll overscroll-y-contain">
            {renderNavigation({
              className: '',
              openNavigation,
              closeNavigation,
              isOnDrawer: false,
            })}
          </div>
        )}
        {/* region: Sub Body */}
        {renderSubBody && (
          <div
            className={classnames(
              'fixed z-layout-subbody right-0 bottom-0 h-[50vh] bg-background shadow-01dp border-t-2 border-on-background-faint overflow-y-scroll overscroll-y-contain',
              {
                'left-[160px]': lg && renderNavigation,
                'left-0': !(lg && renderNavigation),
              }
            )}
          >
            {renderSubBody({ className: '', openNavigation, closeNavigation })}
          </div>
        )}
        {/* region: Body */}
        <div
          className={classnames(
            'flex flex-col flex-1 min-h-full z-layout-body',
            {
              'pt-[8px]': !renderAppBar,
              'pt-[72px]': renderAppBar,
              'pl-[160px]': lg && renderNavigation,
              'pb-[50vh]': renderSubBody,
            }
          )}
        >
          {renderBody({ className: 'flex-1', openNavigation, closeNavigation })}
        </div>
      </div>
      {renderNavigation && (
        <Drawer {...drawer.bind}>
          {renderNavigation({
            className: '',
            openNavigation,
            closeNavigation,
            isOnDrawer: true,
          })}
        </Drawer>
      )}
    </>
  );
};

export default Layout;
