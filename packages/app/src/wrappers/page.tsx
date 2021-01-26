import { PageProps, PluginOptions } from 'gatsby';
import React from 'react';

type Props = {
  pluginOptions: PluginOptions;
} & PageProps;
const PageWrapper: React.FC<Props> = ({ children }) => {
  return (
    <div id="wrapper-page">
      <div>{children}</div>
      <div id="container-modal" />
    </div>
  );
};

export default PageWrapper;
