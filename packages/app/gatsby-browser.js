import React from 'react';
import PageWrapper from './src/wrappers/page';
import RootWrapper from './src/wrappers/root';

// Specify a react component which wraps gatsby root component. No unmounting happens.
// IMPORTANT: Editing gatsby-ssr file is required.
// @see: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/#wrapRootElement
export const wrapRootElement = ({ element }, pluginOptions) => {
  return (
    <RootWrapper pluginOptions={pluginOptions}>
      {element}
    </RootWrapper>
  );
};

// Specify a react component which wraps page components. No unmounting happens.
// IMPORTANT: Editing gatsby-ssr file is required.
// @see: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/#wrapPageElement
export const wrapPageElement = ({ element, props }, pluginOptions) => {
  return (
    <PageWrapper pluginOptions={pluginOptions} {...props}>
      {element}
    </PageWrapper>
  );
};
