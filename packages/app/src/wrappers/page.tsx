import { PageProps, PluginOptions } from 'gatsby';
import React from 'react';

type Props = {
  pluginOptions: PluginOptions
} & PageProps;
const PageWrapper: React.FC<Props> = ({ children }) => {
  return (
    <div id="wrapper-page">{/* TODO: 不要なdivなので後で消すこと。 */}
      {children}
    </div>
  );
};

export default PageWrapper;
