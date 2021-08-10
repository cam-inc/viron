import { BiPlusCircle } from '@react-icons/all-files/bi/BiPlusCircle';
import classnames from 'classnames';
import { PageProps } from 'gatsby';
import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import Metadata from '$components/metadata';
import Modal, { useModal } from '$components/modal';
import Notification, { useNotification } from '$components/notification';
import Paper from '$components/paper';
import useTheme from '$hooks/theme';
import { useTranslation } from '$i18n/index';
import Layout, { Props as LayoutProps } from '$layouts/index';
import { listState as endpointListState } from '$store/atoms/endpoint';
import { constructFakeDocument } from '$utils/oas';
import Add, { Props as AddProps } from './_add/index';
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
    function (/*endpoint*/) {
      notification.open();
    },
    [notification]
  );

  const modal = useModal();
  const handleAddButtonClick = useCallback(
    function () {
      modal.open();
    },
    [modal]
  );

  const renderBody = useCallback<LayoutProps['renderBody']>(
    function ({ className }) {
      return (
        <div
          className={classnames('p-2', className)}
          style={{
            display: 'grid',
            gridGap: '8px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gridAutoRows: 'auto',
          }}
        >
          {endpointList.map(function (endpoint) {
            return (
              <div key={endpoint.id}>
                <Paper className="h-full" elevation={0} shadowElevation={0}>
                  <Endpoint
                    endpoint={endpoint}
                    onRemove={handleRemove}
                    className="h-full"
                  />
                </Paper>
              </div>
            );
          })}
          <div>
            <button
              className="block w-full h-full p-2 min-h-[160px] flex flex-col items-center justify-center border border-dashed border-on-background rounded text-on-background bg-on-background-faint"
              onClick={handleAddButtonClick}
            >
              <BiPlusCircle
                className="mb-2"
                style={{
                  fontSize: '48px',
                }}
              />
              <div>ADD</div>
            </button>
          </div>
          {/* Fill with two blank grid items to adjust UI design. */}
          <div />
          <div />
        </div>
      );
    },
    [endpointList, handleAddButtonClick]
  );

  const { t } = useTranslation();

  const handleAdd = useCallback<AddProps['onAdd']>(
    function () {
      modal.close();
    },
    [modal]
  );

  return (
    <>
      <Metadata title="Home" />
      <Layout
        renderAppBar={renderAppBar}
        renderNavigation={renderNavigation}
        renderBody={renderBody}
      />
      <Modal {...modal.bind}>
        <Add onAdd={handleAdd} />
      </Modal>
      <Notification {...notification.bind}>
        <div>{t('deleted')}</div>
      </Notification>
    </>
  );
};

export default HomePage;