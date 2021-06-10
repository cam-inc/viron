import { TailwindConfig } from '@types/tailwindcss/tailwind-config';
import classnames from 'classnames';
import { PluginOptions } from 'gatsby';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilState } from 'recoil';
import resolveConfig from 'tailwindcss/resolveConfig';
import '$i18n/index';
import { isLaunchedState, screenState, themeState } from '$store/atoms/app';
import '$styles/global.css';
import DrawerWrapper from '$wrappers/drawer';
import ModalWrapper from '$wrappers/modal';
import PopoverWrapper from '$wrappers/popover';
import tailwindConfig from '../../tailwind.config';

type Props = {
  pluginOptions: PluginOptions;
};
const RootWrapper: React.FC<Props> = (props) => {
  return (
    <RecoilRoot>
      {/* Need to wrap a component to encapsulate all state related processes inside the RecoilRoot component.*/}
      <Root {...props} />
    </RecoilRoot>
  );
};
export default RootWrapper;

// the name doesn't matter. It's just a local component.
const Root: React.FC<Props> = ({ children }) => {
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

  const [theme] = useRecoilState(themeState);

  const [, setScreen] = useRecoilState(screenState);
  useEffect(function () {
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
    window.addEventListener('resize', debouncedHander);
    return function cleanup() {
      window.removeEventListener('resize', debouncedHander);
    };
  }, []);
  useEffect(function () {
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
  }, []);

  return (
    <div id="root" className="relative" data-theme={theme}>
      <div className="min-h-screen">{children}</div>
      <DrawerWrapper className="fixed inset-0" />
      <ModalWrapper className="fixed inset-0" />
      <PopoverWrapper className="fixed inset-0" />
      {!isLaunched && <Splash className="fixed inset-0" />}
    </div>
  );
};

const Splash: React.FC<{ className?: string }> = ({ className = '' }) => {
  // TODO
  return (
    <div className={classnames('flex justify-center items-center', className)}>
      <div className="w-6 h-6 bg-black" />
    </div>
  );
};
