import { BiPlusCircle } from '@react-icons/all-files/bi/BiPlusCircle';
import classnames from 'classnames';
import React, { useCallback } from 'react';
import Modal, { useModal } from '$components/modal';
import Notification, { useNotification } from '$components/notification';
import { useTranslation } from '$i18n/index';
import { Props as LayoutProps } from '$layouts/index';
import { useEndpointListGlobalStateValue } from '$store/index';
import Endpoint, { Props as EndpointProps } from './endpoint/index';
import Add, { Props as AddProps } from './add';

export type Props = Parameters<LayoutProps['renderBody']>[0];
const Body: React.FC<Props> = ({ className = '' }) => {
  const endpointList = useEndpointListGlobalStateValue();

  const notification = useNotification();
  const handleRemove = useCallback<EndpointProps['onRemove']>(
    function () {
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

  const { t } = useTranslation();

  const handleAdd = useCallback<AddProps['onAdd']>(
    function () {
      modal.close();
    },
    [modal]
  );

  return (
    <>
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
              <Endpoint endpoint={endpoint} onRemove={handleRemove} />
            </div>
          );
        })}
        <div>
          <button
            className="block w-full h-full p-2 min-h-[160px] flex flex-col items-center justify-center border border-dashed focus:outline-none focus:ring-2 border-on-background rounded text-on-background hover:bg-on-background-faint hover:text-on-background-high hover:border-on-background-high focus:bg-on-background-faint focus:ring-on-background-high active:bg-on-background-faint active:text-on-background-high"
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
        <div />
        <div />
      </div>
      <Modal {...modal.bind}>
        <Add onAdd={handleAdd} />
      </Modal>
      <Notification {...notification.bind}>
        <div>{t('deleted')}</div>
      </Notification>
    </>
  );
};
export default Body;
