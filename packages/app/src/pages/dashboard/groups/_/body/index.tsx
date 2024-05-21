import { PlusIcon } from '@heroicons/react/outline';
import React, { useCallback } from 'react';
import Button, { Props as ButtonProps } from '~/components/button';
import Head from '~/components/head';
import { useEndpoint } from '~/hooks/endpoint';
import { useTranslation } from '~/hooks/i18n';
import { Props as LayoutProps } from '~/layouts/index';
import Modal, { useModal } from '~/portals/modal';
import { COLOR_SYSTEM } from '~/types';
import Menu from '../../../_/menu';
import Add, { Props as AddProps } from './add/';
import Item from './item';

export type Props = Parameters<LayoutProps['renderBody']>[0];
const Body: React.FC<Props> = ({ className, style }) => {
  const { t } = useTranslation();
  const { groupList } = useEndpoint();

  // Add modal.
  const modal = useModal({});
  const handleAddClick = useCallback<ButtonProps['onClick']>(() => {
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
        <div className="max-w-[1252px] mx-auto px-4 lg:px-8">
          {/* Head */}
          <div>
            <div className="py-6 lg:py-10 flex justify-between items-center">
              <Head
                on={COLOR_SYSTEM.BACKGROUND}
                title={<div>{t('dashboard.groups.title')}</div>}
                description={t('dashboard.groups.description')}
              />
              <div className="flex items-center space-x-4">
                <Button
                  variant="outlined"
                  cs={COLOR_SYSTEM.PRIMARY}
                  label={t('addGroupButtonLabel')}
                  Icon={PlusIcon}
                  onClick={handleAddClick}
                />
                <Menu />
              </div>
            </div>
          </div>
          {/* Body */}
          <div className="">
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
