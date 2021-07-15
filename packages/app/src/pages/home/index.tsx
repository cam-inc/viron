import classnames from 'classnames';
import { PageProps } from 'gatsby';
import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import Metadata from '$components/metadata';
import Notification, { useNotification } from '$components/notification';
import Paper from '$components/paper';
import useTheme from '$hooks/theme';
import Layout, { Props as LayoutProps } from '$layouts/index';
import { listState as endpointListState } from '$store/atoms/endpoint';
import { constructFakeDocument } from '$utils/oas';
import Add from './_add/index';
import Appbar from './_appbar';
import Endpoint, { Props as EndpointProps } from './_endpoint';
import Navigation from './_navigation';

type Props = PageProps;
const HomePage: React.FC<Props> = () => {
  const document = constructFakeDocument({
    info: {
      title: 'fake document',
      version: '0.0.0',
      'x-pages': [],
      'x-theme': 'deepOrange',
    },
  });
  useTheme(document);

  const [endpointList] = useRecoilState(endpointListState);

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

  const notification = useNotification();
  const handleRemove = useCallback<EndpointProps['onRemove']>(
    function (endpoint) {
      console.log(endpoint);
      notification.open();
    },
    [notification]
  );

  const renderBody = useCallback<LayoutProps['renderBody']>(
    function ({ className }) {
      return (
        <div className={classnames('p-2', className)}>
          {endpointList.map(function (endpoint) {
            return (
              <div key={endpoint.id} className="mb-2 last:mb-0">
                <Paper elevation={0} shadowElevation={0}>
                  <Endpoint endpoint={endpoint} onRemove={handleRemove} />
                </Paper>
              </div>
            );
          })}
          <div className="mb-2 last:mb-0">
            <Paper elevation={0} shadowElevation={0}>
              <Add />
            </Paper>
          </div>
        </div>
      );
    },
    [endpointList]
  );

  return (
    <>
      <Metadata title="home | Viron" />
      <Layout
        renderAppBar={renderAppBar}
        renderNavigation={renderNavigation}
        renderBody={renderBody}
      />
      <Notification {...notification.bind}>
        <div>TODO: deleted</div>
      </Notification>
    </>
  );
};

export default HomePage;
