import classnames from 'classnames';
import React, { useCallback } from 'react';
import { SIZE as BUTTON_SIZE } from '~/components/button';
import TextButton, { Props as TextButtonProps } from '~/components/button/text';
import FolderIcon from '~/components/icon/folder/outline';
import PlusCircleIcon from '~/components/icon/plusCircle/outline';
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
import AddEndpoint, { Props as AddEndpointProps } from './addGroup';
import AddGroup, { Props as AddGroupProps } from './addGroup';

export type Props = Parameters<LayoutProps['renderBody']>[0];
const Body: React.FC<Props> = ({ className = '' }) => {
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
  const handleAddEndpointClick = useCallback<TextButtonProps['onClick']>(() => {
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

  const modalAddGroup = useModal();
  const handleAddGroupClick = useCallback<TextButtonProps['onClick']>(() => {
    modalAddGroup.open();
  }, [modalAddGroup.open]);
  const handleAddGroupAdd = useCallback<AddGroupProps['onAdd']>(() => {
    modalAddGroup.close();
  }, [modalAddGroup.close]);
  const handleAddGroupCancelClick = useCallback<
    AddGroupProps['onCancelClick']
  >(() => {
    modalAddGroup.close();
  }, [modalAddGroup.close]);

  return (
    <>
      <div className={classnames('p-4 flex flex-col gap-2', className)}>
        <div>
          <div>
            <TextButton
              cs={COLOR_SYSTEM.SECONDARY}
              label="Add Endpoint"
              Icon={PlusCircleIcon}
              size={BUTTON_SIZE.XS}
              onClick={handleAddEndpointClick}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <div className="flex-none text-thm-on-surface text-sm">
              Endpoints
            </div>
            <div className="flex-1 border-t border-dashed border-thm-on-surface-slight" />
            <div className="flex-none flex items-center gap-2">
              <div>
                <TextButton
                  cs={COLOR_SYSTEM.SECONDARY}
                  label="Add Group"
                  Icon={FolderIcon}
                  size={BUTTON_SIZE.XS}
                  onClick={handleAddGroupClick}
                />
              </div>
            </div>
          </div>
          <ul>
            {endpointListByGroup.map((item) => (
              <li key={item.group.id}>
                <EndpointGroup group={item.group} list={item.list} />
                <ul>
                  <div>{item.group?.name || 'Ungrouped'}</div>
                  {item.list.map((endpoint) => (
                    <li key={endpoint.id}>
                      <Endpoint endpoint={endpoint} onRemove={handleRemove} />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            {endpointListUngrouped.length && (
              <li>
                <ul>
                  {endpointListUngrouped.map((endpoint) => (
                    <li key={endpoint.id}>
                      <Endpoint endpoint={endpoint} onRemove={handleRemove} />
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
      <Modal {...modalAddEndpoint.bind}>
        <AddEndpoint
          onAdd={handleAddEndpointAdd}
          onCancelClick={handleAddEndpointCancelClick}
        />
      </Modal>
      <Modal {...modalAddGroup.bind}>
        <AddGroup
          onAdd={handleAddGroupAdd}
          onCancelClick={handleAddGroupCancelClick}
        />
      </Modal>
      <Notification {...notification.bind}>
        <div>{t('deleted')}</div>
      </Notification>
    </>
  );
};
export default Body;
