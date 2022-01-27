import classnames from 'classnames';
import { PluginOptions } from 'gatsby';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HelmetProvider } from 'react-helmet-async';
import resolveConfig from 'tailwindcss/resolveConfig';
import { TailwindConfig } from 'tailwindcss/tailwind-config';
// @ts-ignore
import tailwindConfig from '../../tailwind.config';
import Error, { useError } from '~/components/error';
import ErrorBoundary from '~/components/errorBoundary';
import Spinner from '~/components/spinner';
import { UnhandledError } from '~/errors';
import '~/i18n';
import {
  GlobalStateProvider,
  useAppIsLaunchedGlobalState,
  useAppScreenGlobalStateSet,
  useAppThemeGlobalStateValue,
} from '~/store';
import '~/styles/global.css';
import { ClassName, COLOR_SYSTEM } from '~/types';
import { getCustomProperties } from '~/utils/colorSystem';
import DrawerWrapper from '~/wrappers/drawer';
import ModalWrapper from '~/wrappers/modal';
import NotificationWrapper from '~/wrappers/notification';
import PopoverWrapper from '~/wrappers/popover';
import ProgressWrapper from '~/wrappers/progress';

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
            <GlobalStateProvider>
              <ErrorBoundary on={COLOR_SYSTEM.BACKGROUND}>
                {/* Need to wrap a react component to encapsulate all state related processes inside the RecoilRoot component. */}
                <Root {...props} />
              </ErrorBoundary>
            </GlobalStateProvider>
          </DndProvider>
        </HelmetProvider>
      </React.StrictMode>
    </React.Fragment>
  );
};
export default RootWrapper;

const Root: React.FC<Props> = ({ children }) => {
  // Entry point.
  const { launch, isLaunched, style } = useRoot();
  useEffect(() => {
    launch();
  }, []);

  // Handle non-react-related errors that are dismissed.
  const error = useError({
    on: COLOR_SYSTEM.SURFACE,
    withModal: true,
  });
  useEffect(() => {
    const handler = (e: ErrorEvent) => {
      error.setError(new UnhandledError(e.message));
    };
    window.addEventListener('error', handler);
    return () => {
      window.removeEventListener('error', handler);
    };
  }, [error.setError]);

  return (
    <>
      {style}
      <div id="root" className="relative font-mono">
        <div>{children}</div>
        <DrawerWrapper className="fixed inset-0 z-wrapper-drawer" />
        <ModalWrapper className="fixed inset-0 z-wrapper-modal" />
        <PopoverWrapper className="fixed inset-0 z-wrapper-popover" />
        <NotificationWrapper className="fixed left-0 right-0 bottom-0 pr-4 pb-4 z-wrapper-notification" />
        <ProgressWrapper className="fixed inset-0 z-wrapper-progress" />
        <Splash isActive={!isLaunched} className="fixed inset-0 z-splash" />
      </div>
      <Error {...error.bind} />
    </>
  );
};

type UseRootReturn = {
  launch: () => Promise<void>;
  isLaunched: boolean;
  style: JSX.Element;
};
const useRoot = function (): UseRootReturn {
  const [isLaunched, setIsLaunched] = useAppIsLaunchedGlobalState();
  const setScreen = useAppScreenGlobalStateSet();
  const theme = useAppThemeGlobalStateValue();

  const launch = useCallback(async () => {
    if (isLaunched) {
      return;
    }
    setIsLaunched(true);
  }, [isLaunched, setIsLaunched]);

  // Watch theme.
  const style = useMemo(() => {
    const customProperties = getCustomProperties(theme);
    let str = 'body{';
    Object.entries(customProperties).forEach(([key, value]) => {
      str = `${str}${key}:${value};`;
    });
    str = `${str}}`;
    return <style>{str}</style>;
  }, [theme]);

  // Watch screen size.
  useEffect(() => {
    const handler = function () {
      const { innerWidth, innerHeight } = window;
      setScreen(function (currVal) {
        return {
          ...currVal,
          width: innerWidth,
          height: innerHeight,
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
  }, [setScreen]);

  // Watch Media Queries.
  useEffect(() => {
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
  }, [setScreen]);

  return {
    launch,
    isLaunched,
    style,
  };
};

const Splash: React.FC<{ isActive: boolean; className?: ClassName }> = ({
  isActive,
  className = '',
}) => {
  return (
    <div
      className={classnames(
        'flex items-center justify-center bg-thm-surface transition',
        {
          'opacity-100 scale-100 pointer-events-auto': isActive,
          'opacity-0 scale-110 pointer-events-none': !isActive,
        },
        className
      )}
    >
      <Spinner className="flex-none w-12" on={COLOR_SYSTEM.SURFACE} />
    </div>
  );
};
