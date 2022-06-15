import { PageProps } from 'gatsby';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Metadata from '~/components/metadata';
import useTheme from '~/hooks/theme';
import Layout, { Props as LayoutProps } from '~/layouts';
import AppBar from './_/appBar';
import Body from './_/body';
import Navigation from './_/navigation';

type Props = PageProps;
const NotfoundPage: React.FC<Props> = () => {
  useTheme();
  const { t } = useTranslation();

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
      <Metadata title={t('pages.404.001')} />
      <Layout
        renderAppBar={renderAppBar}
        renderNavigation={renderNavigation}
        renderBody={renderBody}
      />
    </>
  );
};

export default NotfoundPage;
