import { PluginOptions } from 'gatsby';
import React from 'react';
import { Provider as StateProvider } from '@state';
import '@styles/global.css';

type Props = {
  pluginOptions: PluginOptions;
};
const RootWrapper: React.FC<Props> = ({ children }) => {
  return (
    <>
      {/* wrapper-root */}
      <StateProvider>{children}</StateProvider>
    </>
  );
};

export default RootWrapper;
