import classnames from 'classnames';
import { PageProps } from 'gatsby';
import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import Metadata from '$components/metadata';
import Paper from '$components/paper';
import useTheme from '$hooks/theme';
import Layout, { Props as LayoutProps } from '$layouts/index';
import { listState as endpointListState } from '$store/atoms/endpoint';
import { constructFakeDocument } from '$utils/oas';
import Add from './_add/index';
import Appbar from './_appbar';
import Endpoint from './_endpoint';
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

  const renderAppBar = useCallback<LayoutProps['renderAppBar']>(function (
    args
  ) {
    return <Appbar {...args} />;
  },
  []);

  const renderNavigation = useCallback<LayoutProps['renderNavigation']>(
    function (args) {
      return <Navigation {...args} />;
    },
    []
  );

  const renderBody = useCallback<LayoutProps['renderBody']>(
    function ({ className }) {
      return (
        <div className={classnames('p-2', className)}>
          {endpointList.map(function (endpoint) {
            return (
              <div key={endpoint.id} className="mb-2 last:mb-0">
                <Paper elevation={0} shadowElevation={0}>
                  <Endpoint endpoint={endpoint} />
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
    </>
  );
};

export default HomePage;
