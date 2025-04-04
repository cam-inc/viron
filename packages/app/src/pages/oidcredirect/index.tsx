import { PageProps, graphql } from 'gatsby';
import React, { useCallback } from 'react';
import Metadata from '~/components/metadata';
import useTheme from '~/hooks/theme';
import Layout, { Props as LayoutProps } from '~/layouts';
import AppBar from './_/appBar';
import Body from './_/body';
import Navigation from './_/navigation';

type Props = PageProps;
const OidcRedirectPage: React.FC<Props> = ({ location }) => {
  useTheme();

  const renderAppBar = useCallback<NonNullable<LayoutProps['renderAppBar']>>(
    (args) => <AppBar {...args} />,
    []
  );

  const renderNavigation = useCallback<
    NonNullable<LayoutProps['renderNavigation']>
  >((args) => <Navigation {...args} />, []);

  const renderBody = useCallback<LayoutProps['renderBody']>(
    (args) => <Body {...args} search={location.search} />,
    [location.search]
  );

  return (
    <>
      <Metadata title="OIDC" />
      <Layout
        renderAppBar={renderAppBar}
        renderNavigation={renderNavigation}
        renderBody={renderBody}
      />
    </>
  );
};
export default OidcRedirectPage;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
