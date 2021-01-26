import { PageProps, PluginOptions } from 'gatsby';
import React from 'react';
import ModalWrapper from './modal';

type Props = {
  pluginOptions: PluginOptions;
} & PageProps;
const PageWrapper: React.FC<Props> = ({ children }) => {
  return (
    <>
      {/* wrapper-page */}
      <div className="relative min-h-screen">
        <div>{children}</div>
        <ModalWrapper className="fixed inset-0" />
      </div>
    </>
  );
};

export default PageWrapper;
