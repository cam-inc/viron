import { PageProps, graphql } from 'gatsby';
import React from 'react';
import { AppSidebar } from '~/components/app-sidebar';
import Metadata from '~/components/metadata';
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import useTheme from '~/hooks/theme';
import Body from './_/body/';

type Props = PageProps;
const DashboardEndpointsPage: React.FC<Props> = () => {
  useTheme();

  return (
    <>
      <Metadata title="Dashboard" />
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <Body />
        </main>
      </SidebarProvider>
    </>
  );
};

export default DashboardEndpointsPage;

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
