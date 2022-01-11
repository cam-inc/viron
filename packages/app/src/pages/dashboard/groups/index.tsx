import { PageProps } from 'gatsby';
import React, { useCallback } from 'react';
import Metadata from '~/components/metadata';
import useTheme from '~/hooks/theme';
import Layout, { Props as LayoutProps } from '~/layouts/index';
import Appbar from '../_/appBar';
import Navigation from '../_/navigation';
import Body from './_/body';

type Props = PageProps;
const DashboardGroupsPage: React.FC<Props> = () => {
  useTheme();

  const renderAppBar = useCallback<NonNullable<LayoutProps['renderAppBar']>>(
    (args) => <Appbar {...args} />,
    []
  );

  const renderNavigation = useCallback<
    NonNullable<LayoutProps['renderNavigation']>
  >((args) => <Navigation {...args} />, []);

  const renderBody = useCallback<LayoutProps['renderBody']>(
    (args) => <Body {...args} />,
    []
  );

  return (
    <>
      <Metadata title="Dashboard" />
      <Layout
        renderAppBar={renderAppBar}
        renderNavigation={renderNavigation}
        renderBody={renderBody}
      />
    </>
  );
};

export default DashboardGroupsPage;
