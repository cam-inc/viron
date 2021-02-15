import classnames from 'classnames';
import { PluginOptions } from 'gatsby';
import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilState } from 'recoil';
import { isLaunched as isLaunchedAtom } from '@store/atoms/app';
import ModalWrapper from '@wrappers/modal';
import '@styles/global.css';

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
  const [isLaunched, setIsLaunched] = useRecoilState(isLaunchedAtom);
  useEffect(function () {
    setIsLaunched(true);
  }, []);

  return (
    <div className="relative">
      <div className="min-h-screen">{children}</div>
      <ModalWrapper className="fixed inset-0" />
      {!isLaunched && <Splash className="fixed inset-0" />}
    </div>
  );
};

const Splash: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={classnames('flex justify-center items-center', className)}>
      <div className="w-6 h-6 bg-black" />
    </div>
  );
};
