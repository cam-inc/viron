import classnames from 'classnames';
import { PluginOptions } from 'gatsby';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HelmetProvider } from 'react-helmet-async';
import { RecoilRoot, useRecoilState } from 'recoil';
import resolveConfig from 'tailwindcss/resolveConfig';
import { TailwindConfig } from 'tailwindcss/tailwind-config';
import ErrorBoundary from '$components/errorBoundary';
import Spinner from '$components/spinner';
import { ON } from '$constants/index';
import '$i18n/index';
import { isLaunchedState, screenState, themeState } from '$store/atoms/app';
import '$styles/global.css';
import { ClassName } from '$types/index';
import DrawerWrapper from '$wrappers/drawer';
import ModalWrapper from '$wrappers/modal';
import NotificationWrapper from '$wrappers/notification';
import PopoverWrapper from '$wrappers/popover';
import ProgressWrapper from '$wrappers/progress';
// @ts-ignore
import tailwindConfig from '../../tailwind.config';

type Props = {
  pluginOptions: PluginOptions;
};
const RootWrapper: React.FC<Props> = (props) => {
  return (
    <React.Fragment>
      {/* Use StrictMode to find potential problems. Only run in development mode. */}
      {/* @see: https://reactjs.org/docs/strict-mode.html */}
      <React.StrictMode>
        <HelmetProvider>
          <DndProvider backend={HTML5Backend}>
            <RecoilRoot>
              <ErrorBoundary on={ON.BACKGROUND}>
                {/* Need to wrap a react component to encapsulate all state related processes inside the RecoilRoot component. */}
                <Root {...props} />
              </ErrorBoundary>
            </RecoilRoot>
          </DndProvider>
        </HelmetProvider>
      </React.StrictMode>
    </React.Fragment>
  );
};
export default RootWrapper;

// the name doesn't matter. It's just a local component.
const Root: React.FC<Props> = ({ children }) => {
  // App launching.
  const [isLaunched, setIsLaunched] = useRecoilState(isLaunchedState);
  useEffect(
    function () {
      const init = async function (): Promise<void> {
        setIsLaunched(true);
      };
      init();
    },
    [setIsLaunched]
  );

  // Theme switching.
  const [theme] = useRecoilState(themeState);
  useEffect(
    function () {
      const bodyElm = document.querySelector('body');
      if (!bodyElm) {
        return;
      }
      bodyElm.dataset.theme = theme || '';
    },
    [theme]
  );

  // Screen info.
  const [, setScreen] = useRecoilState(screenState);
  useEffect(
    function () {
      const handler = function () {
        const { clientWidth, clientHeight } = document.documentElement;
        setScreen(function (currVal) {
          return {
            ...currVal,
            width: clientWidth,
            height: clientHeight,
          };
        });
      };
      handler();
      const debouncedHander = _.debounce(handler, 1000);
      window.addEventListener('resize', debouncedHander, {
        passive: true,
      });
      return function cleanup() {
        window.removeEventListener('resize', debouncedHander);
      };
    },
    [setScreen]
  );
  useEffect(
    function () {
      const set = function (matches: MediaQueryListEvent['matches']) {
        setScreen(function (currVal) {
          return {
            ...currVal,
            lg: matches,
          };
        });
      };
      const config = resolveConfig(tailwindConfig as TailwindConfig);
      const mediaQueryList = window.matchMedia(
        `(min-width: ${config.theme.screens?.lg})`
      );
      set(mediaQueryList.matches);

      const handler = function (e: MediaQueryListEvent) {
        set(e.matches);
      };
      mediaQueryList.addEventListener('change', handler);
      return function cleanup() {
        mediaQueryList.removeEventListener('change', handler);
      };
    },
    [setScreen]
  );

  return (
    <div id="root" className="relative font-mono">
      <div className="min-h-screen">{children}</div>
      <DrawerWrapper className="fixed inset-0 z-wrapper-drawer" />
      <ModalWrapper className="fixed inset-0 z-wrapper-modal" />
      <PopoverWrapper className="fixed inset-0 z-wrapper-popover" />
      <NotificationWrapper className="fixed left-0 right-0 bottom-0 pr-4 pb-4 z-wrapper-notification" />
      <ProgressWrapper className="fixed inset-0 z-wrapper-progress" />
      <Splash isActive={!isLaunched} className="fixed inset-0 z-splash" />
    </div>
  );
};

const Splash: React.FC<{ isActive: boolean; className?: ClassName }> = ({
  isActive,
  className = '',
}) => {
  return (
    <div
      className={classnames(
        'flex items-center justify-center bg-surface transition',
        {
          'opacity-100 scale-100 pointer-events-auto': isActive,
          'opacity-0 scale-110 pointer-events-none': !isActive,
        },
        className
      )}
    >
      <Spinner className="flex-none w-12" on={ON.SURFACE} />
    </div>
  );
};
