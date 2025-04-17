import { PageProps, graphql } from 'gatsby';
import React from 'react';
import { AppSidebar } from '~/components/app-sidebar';
import Metadata from '~/components/metadata';
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';
import useTheme from '~/hooks/theme';
import Body from './_/body';

type Props = PageProps;
const OAuthRedirectPage: React.FC<Props> = ({ location }) => {
  useTheme();

  return (
    <>
      <Metadata title="OAuth" />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Body search={location.search} />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};
export default OAuthRedirectPage;

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
