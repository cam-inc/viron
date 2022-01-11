import React, { useCallback } from 'react';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import TextButton, { Props as TextButtonProps } from '~/components/button/text';
import FolderIcon from '~/components/icon/folder/outline';
import PlusCircleIcon from '~/components/icon/plusCircle/outline';
import Title from '~/components/title';
import { useTranslation } from '~/i18n/index';
import { Props as LayoutProps } from '~/layouts/index';
import Modal, { useModal } from '~/portals/modal';
import Notification, { useNotification } from '~/portals/notification';
import {
  useEndpointListByGroupGlobalStateValue,
  useEndpointListUngroupedGlobalStateValue,
} from '~/store/index';
import { COLOR_SYSTEM } from '~/types';
import Endpoint, { Props as EndpointProps } from './endpoint';
import EndpointGroup from './endpointGroup';
import AddEndpoint, { Props as AddEndpointProps } from './addEndpoint';

export type Props = Parameters<LayoutProps['renderBody']>[0];
const Body: React.FC<Props> = ({ className, style }) => {
  const endpointListByGroup = useEndpointListByGroupGlobalStateValue();
  const endpointListUngrouped = useEndpointListUngroupedGlobalStateValue();

  const notification = useNotification();
  const handleRemove = useCallback<EndpointProps['onRemove']>(
    function () {
      notification.open();
    },
    [notification]
  );

  const { t } = useTranslation();

  const modalAddEndpoint = useModal();
  const handleAddEndpointClick = useCallback<
    FilledButtonProps['onClick']
  >(() => {
    modalAddEndpoint.open();
  }, [modalAddEndpoint.open]);
  const handleAddEndpointAdd = useCallback<AddEndpointProps['onAdd']>(() => {
    modalAddEndpoint.close();
  }, [modalAddEndpoint.close]);
  const handleAddEndpointCancelClick = useCallback<
    AddEndpointProps['onCancelClick']
  >(() => {
    modalAddEndpoint.close();
  }, [modalAddEndpoint.close]);

  return (
    <>
      <div className={className} style={style}>
        <div className="p-4 space-y-2">
          {/* Head */}
          <div className="flex items-center justify-between">
            <div className="flex-none">
              <Title on={COLOR_SYSTEM.BACKGROUND} label="Dashboard" />
            </div>
            <div className="flex-none">
              <FilledButton
                cs={COLOR_SYSTEM.PRIMARY}
                label="Add Endpoint"
                Icon={PlusCircleIcon}
                size={BUTTON_SIZE.BASE}
                onClick={handleAddEndpointClick}
              />
            </div>
          </div>
          {/* Endpoints */}
          <div>
            {/* Endpoints: Head */}
            <div className="flex items-center justify-between border-b border-thm-on-surface-slight pb-1 mb-4">
              <div className="flex-none text-thm-on-surface text-sm">
                Endpoints
              </div>
            </div>
            {/* Endpoints: Grouped */}
            <ul>
              {endpointListByGroup.map((item) => (
                <li key={item.group.id}>
                  <EndpointGroup group={item.group} list={item.list} />
                </li>
              ))}
            </ul>
            {/* Endpoints: Ungrouped */}
            {endpointListUngrouped.length && (
              <ul>
                {endpointListUngrouped.map((endpoint) => (
                  <li key={endpoint.id}>
                    <Endpoint endpoint={endpoint} onRemove={handleRemove} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Modal {...modalAddEndpoint.bind}>
        <AddEndpoint
          onAdd={handleAddEndpointAdd}
          onCancelClick={handleAddEndpointCancelClick}
        />
      </Modal>
      <Notification {...notification.bind}>
        <div>{t('deleted')}</div>
      </Notification>
    </>
  );
};
export default Body;
