import { PluginOptions } from 'gatsby';
import React from 'react';
import { Provider as StateProvider } from '@state';
import '@styles/global.css';

type Props = {
  pluginOptions: PluginOptions;
};
const RootWrapper: React.FC<Props> = ({ children }) => {
  console.log('[RootWrapper]: rendered');
  return (
    <div id="wrapper-root">
      {/* TODO: 不要なdivなので後で消すこと。 */}
      <StateProvider>{children}</StateProvider>
    </div>
  );
};

export default RootWrapper;
