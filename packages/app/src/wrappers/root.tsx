import classnames from 'classnames';
import { PluginOptions } from 'gatsby';
import _ from 'lodash';
import { Loader2Icon } from 'lucide-react';
import React, { PropsWithChildren, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HelmetProvider } from 'react-helmet-async';
//import resolveConfig from 'tailwindcss/resolveConfig';
//import { TailwindConfig } from 'tailwindcss/tailwind-config';
// @ts-ignore
//import tailwindConfig from '../../tailwind.config';
import Error, { useError } from '~/components/error';
import ErrorBoundary from '~/components/errorBoundary';
import { UnhandledError } from '~/errors';
import {
  GlobalStateProvider,
  useAppIsLaunchedGlobalState,
  useAppScreenGlobalStateSet,
  useAppThemeGlobalStateValue,
} from '~/store';
import '~/styles/global.css';
import { ClassName, COLOR_SYSTEM } from '~/types';

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

const Root: React.FC<PropsWithChildren<Props>> = ({ children }) => {
  // Entry point.
  const { launch, isLaunched, error } = useRoot();

  useEffect(() => {
    launch();
  }, [launch]);

  return (
    <>
      <div id="root" className="relative">
        <div>{children}</div>
        <Splash isActive={!isLaunched} className="fixed inset-0 z-splash" />
      </div>
      <Error {...error.bind} withModal={true} />
    </>
  );
};

type UseRootReturn = {
  launch: () => Promise<void>;
  isLaunched: boolean;
  error: ReturnType<typeof useError>;
};
const useRoot = (): UseRootReturn => {
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
  useEffect(() => {
    document.body.classList.remove(
      ...Array.from(document.body.classList).filter((cls) =>
        cls.startsWith('theme-')
      )
    );
    document.body.classList.add(`theme-${theme.replace(/\s/g, '-')}`);
  }, [theme]);

  // Watch screen size.
  useEffect(() => {
    const handler = () => {
      const { innerWidth, innerHeight } = window;
      setScreen((currVal) => {
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
    // A cleanup function.
    return () => {
      window.removeEventListener('resize', debouncedHander);
    };
  }, [setScreen]);

  // Watch Media Queries.
  useEffect(() => {
    const set = (matches: MediaQueryListEvent['matches']) => {
      setScreen((currVal) => {
        return {
          ...currVal,
          lg: matches,
        };
      });
    };
    //const config = resolveConfig(tailwindConfig as TailwindConfig);
    const mediaQueryList = window.matchMedia(
      // TODO:
      //`(min-width: ${config.theme.screens?.lg})`
      `(min-width: 640px)`
    );
    set(mediaQueryList.matches);

    const handler = (e: MediaQueryListEvent) => {
      set(e.matches);
    };
    mediaQueryList.addEventListener('change', handler);
    return function cleanup() {
      mediaQueryList.removeEventListener('change', handler);
    };
  }, [setScreen]);

  // Handle non-react-related errors that are dismissed.
  const error = useError({
    on: COLOR_SYSTEM.SURFACE,
    withModal: true,
  });
  const setError = error.setError;

  useEffect(() => {
    const handler = (e: ErrorEvent) => {
      setError(new UnhandledError(e.message));
    };
    window.addEventListener('error', handler);
    return () => {
      window.removeEventListener('error', handler);
    };
  }, [setError]);

  return {
    launch,
    isLaunched,
    error,
  };
};

const Splash: React.FC<{ isActive: boolean; className?: ClassName }> = ({
  isActive,
  className = '',
}) => {
  return (
    <div
      className={classnames(
        'flex items-center justify-center bg-background transition',
        {
          'opacity-100 scale-100 pointer-events-auto': isActive,
          'opacity-0 scale-110 pointer-events-none': !isActive,
        },
        className
      )}
    >
      <Loader2Icon className="size-12 animate-spin" />
    </div>
  );
};
