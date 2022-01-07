import { PageProps } from 'gatsby';
import React, { useCallback } from 'react';
import Metadata from '~/components/metadata';
import useTheme from '~/hooks/theme';
import Layout, { Props as LayoutProps } from '~/layouts';
import AppBar from './_/appBar';
import Body from './_/body';
import Navigation from './_/navigation';

type Props = PageProps;
const EndpointImportPagge: React.FC<Props> = ({ location }) => {
  useTheme();

  const renderAppBar = useCallback<NonNullable<LayoutProps['renderAppBar']>>(
    (args) => <AppBar {...args} />,
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
      <Metadata title="Import" />
      <Layout
        renderAppBar={renderAppBar}
        renderNavigation={renderNavigation}
        renderBody={renderBody}
      />
    </>
  );
};
export default EndpointImportPagge;
