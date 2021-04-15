import { PageProps, PluginOptions } from 'gatsby';
import React from 'react';

type Props = {
  pluginOptions: PluginOptions;
} & PageProps;
const PageWrapper: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default PageWrapper;
