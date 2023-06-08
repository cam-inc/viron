import React, { useCallback } from 'react';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import Head from '~/components/head';
import CollectionIcon from '~/components/icon/collection/outline';
import PlusCircleIcon from '~/components/icon/plusCircle/outline';
import { useEndpoint } from '~/hooks/endpoint';
import { Props as LayoutProps } from '~/layouts/index';
import Modal, { useModal } from '~/portals/modal';
import { COLOR_SYSTEM } from '~/types';
import Tabs, { ITEM as TABS_ITEM } from '../../../_/tabs/';
import Add, { Props as AddProps } from './add/';
import Item from './item';

export type Props = Parameters<LayoutProps['renderBody']>[0];
const Body: React.FC<Props> = ({ className, style }) => {
  const { groupList } = useEndpoint();

  // Add modal.
  const modal = useModal();
  const handleAddClick = useCallback<FilledButtonProps['onClick']>(() => {
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
            <div className="p-4">
              <Head
                on={COLOR_SYSTEM.BACKGROUND}
                title={
                  <div className="flex items-center gap-2">
                    <CollectionIcon className="w-em" />
                    <div>Dashboard / Groups</div>
                  </div>
                }
                description="This is your personal, private dashboard."
              />
            </div>
            <div>
              <Tabs item={TABS_ITEM.GROUPS} />
            </div>
          </div>
          {/* Body */}
          <div className="">
            <div className="p-4 flex justify-end border-b border-thm-on-background-slight">
              <FilledButton
                cs={COLOR_SYSTEM.PRIMARY}
                label="Add a Group"
                Icon={PlusCircleIcon}
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
