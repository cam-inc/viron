import { PluginOptions } from 'gatsby';
import React from 'react';
import { RecoilRoot } from 'recoil';
import '@styles/global.css';

type Props = {
  pluginOptions: PluginOptions;
};
const RootWrapper: React.FC<Props> = ({ children }) => {
  return (
    <>
      {/* wrapper-root */}
      <RecoilRoot>{children}</RecoilRoot>
    </>
  );
};

export default RootWrapper;
