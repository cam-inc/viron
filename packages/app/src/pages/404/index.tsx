import { PageProps, graphql } from 'gatsby';
import { FrownIcon } from 'lucide-react';
import React from 'react';
import { AppSidebar } from '~/components/app-sidebar';
import Metadata from '~/components/metadata';
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';
import useTheme from '~/hooks/theme';

type Props = PageProps;
const NotfoundPage: React.FC<Props> = () => {
  useTheme();

  return (
    <>
      <Metadata title="NotFound" />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="justify-center">
          <div className="flex flex-col items-center gap-2">
            <FrownIcon className="size-6" />
            <h1 className="text-xl font-bold">Page Not Found...</h1>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default NotfoundPage;

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
