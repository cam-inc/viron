import classnames from 'classnames';
import { PageProps } from 'gatsby';
import React, { useCallback } from 'react';
import Metadata from '$components/metadata';
import useTheme from '$hooks/theme';
import Layout, { Props as LayoutProps } from '$layouts/index';
import Appbar from './_parts/_appbar/index';
import Navigation from './_parts/_navigation/index';

type Props = PageProps;
const NotfoundPage: React.FC<Props> = () => {
  useTheme();

  const renderAppBar = useCallback<NonNullable<LayoutProps['renderAppBar']>>(
    function (args) {
      return <Appbar {...args} />;
    },
    []
  );

  const renderNavigation = useCallback<
    NonNullable<LayoutProps['renderNavigation']>
  >(function (args) {
    return <Navigation {...args} />;
  }, []);

  const renderBody = useCallback<LayoutProps['renderBody']>(function ({
    className = '',
  }) {
    return <div className={classnames('p-2', className)}>TODO: 404</div>;
  },
  []);

  return (
    <>
      <Metadata title="NotFound" />
      <Layout
        renderAppBar={renderAppBar}
        renderNavigation={renderNavigation}
        renderBody={renderBody}
      />
    </>
  );
};

export default NotfoundPage;
