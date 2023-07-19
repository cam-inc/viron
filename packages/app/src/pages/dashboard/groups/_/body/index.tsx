import { PlusIcon } from '@heroicons/react/outline';
import React, { useCallback } from 'react';
import OutlineButton, {
  Props as OutlineButtonProps,
} from '~/components/button/outline';
import Head from '~/components/head';
import { useEndpoint } from '~/hooks/endpoint';
import { useTranslation } from '~/hooks/i18n';
import { Props as LayoutProps } from '~/layouts/index';
import Modal, { useModal } from '~/portals/modal';
import { COLOR_SYSTEM } from '~/types';
import Tabs, { ITEM as TABS_ITEM } from '../../../_/tabs';
import Add, { Props as AddProps } from './add/';
import Item from './item';

export type Props = Parameters<LayoutProps['renderBody']>[0];
const Body: React.FC<Props> = ({ className, style }) => {
  const { t } = useTranslation();
  const { groupList } = useEndpoint();

  // Add modal.
  const modal = useModal();
  const handleAddClick = useCallback<OutlineButtonProps['onClick']>(() => {
    modal.open();
  }, [modal.open]);
  const handleAddAdd = useCallback<AddProps['onAdd']>(() => {
    modal.close();
  }, [modal.close]);
  const handleAddCancel = useCallback<AddProps['onCancel']>(() => {
    modal.close();
  }, [modal.close]);

  return (
    <>
      <div className={className} style={style}>
        <div className="">
          {/* Head */}
          <div>
            <div className="py-6 pl-8">
              <Head
                on={COLOR_SYSTEM.BACKGROUND}
                title={<div>{t('dashboard.groups.title')}</div>}
                description={t('dashboard.groups.description')}
              />
            </div>
            <div>
              <Tabs item={TABS_ITEM.GROUPS} />
            </div>
          </div>
          {/* Body */}
          <div className="">
            <div className="p-4 flex justify-end border-b border-thm-on-background-slight">
              <OutlineButton.renewal
                cs={COLOR_SYSTEM.PRIMARY}
                label={t('addEndpointButtonLabel')}
                Icon={PlusIcon}
                onClick={handleAddClick}
              />
            </div>
            <ul className="">
              {groupList.map((group) => (
                <li
                  key={group.id}
                  className="border-b border-dashed border-thm-on-background-faint pb-2 mb-2 last:border-none last:mb-0 last:pb-0"
                >
                  <Item group={group} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Modal {...modal.bind}>
        <Add onAdd={handleAddAdd} onCancel={handleAddCancel} />
      </Modal>
    </>
  );
};
export default Body;
