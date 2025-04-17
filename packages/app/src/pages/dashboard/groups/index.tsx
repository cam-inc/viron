import { PageProps, graphql } from 'gatsby';
import React from 'react';
import { AppSidebar } from '~/components/app-sidebar';
import Metadata from '~/components/metadata';
import { Separator } from '~/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar';
import { useTranslation } from '~/hooks/i18n';
import useTheme from '~/hooks/theme';
import Body from './_/body';

type Props = PageProps;
const DashboardGroupsPage: React.FC<Props> = () => {
  useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Metadata title="Dashboard" />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
              />
              <h1 className="text-base font-medium">
                {t('internalPagePaths.groups')}
              </h1>
            </div>
          </header>
          <Body className="flex-1" />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default DashboardGroupsPage;

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
