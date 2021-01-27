import { PageProps, PluginOptions } from 'gatsby';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { isLaunched as isLaunchedAtom } from '@store/atoms/app';
import ModalWrapper from './modal';
import Splash from './splash';

type Props = {
  pluginOptions: PluginOptions;
} & PageProps;
const PageWrapper: React.FC<Props> = ({ children }) => {
  const [isLaunched, setIsLaunched] = useRecoilState(isLaunchedAtom);
  useEffect(() => {
    setIsLaunched(true);
  }, []);
  return (
    <>
      {/* wrapper-page */}
      <div className="relative min-h-screen">
        <div>{children}</div>
        <ModalWrapper className="fixed inset-0" />
        {!isLaunched && <Splash className="fixed inset-0" />}
      </div>
    </>
  );
};

export default PageWrapper;
