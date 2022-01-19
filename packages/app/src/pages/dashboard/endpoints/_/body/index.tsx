import classnames from 'classnames';
import React, { useCallback, useState } from 'react';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import TextButton, {
  Props as TextButtonProps,
} from '~/components/button/text/on';
import Head from '~/components/head';
import CollectionOutlineIcon from '~/components/icon/collection/outline';
import CollectionSolidIcon from '~/components/icon/collection/solid';
import ColorSwatchIcon from '~/components/icon/colorSwatch/outline';
import PlusCircleIcon from '~/components/icon/plusCircle/outline';
import Modal, { useModal } from '~/portals/modal';
import { useEndpoint } from '~/hooks/endpoint';
import { Props as LayoutProps } from '~/layouts/';
import { COLOR_SYSTEM, Endpoint, EndpointGroup } from '~/types';
import Tabs, { ITEM as TABS_ITEM } from '../../../_/tabs';
import Add, { Props as AddProps } from './add/';
import Item from './item/';

export type Props = Parameters<LayoutProps['renderBody']>[0];
const Body: React.FC<Props> = ({ className, style }) => {
  const { listByGroup, listUngrouped } = useEndpoint();

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
                    <ColorSwatchIcon className="w-em" />
                    <div>Dashboard / Endpoints</div>
                  </div>
                }
                description="This is your personal, private dashboard."
              />
            </div>
            <div>
              <Tabs item={TABS_ITEM.ENDPOINTS} />
            </div>
          </div>
          {/* Body */}
          <div className="">
            <div className="p-4 flex justify-end border-b border-thm-on-background-slight">
              <FilledButton
                cs={COLOR_SYSTEM.PRIMARY}
                label="Add an Endpoint"
                Icon={PlusCircleIcon}
                onClick={handleAddClick}
              />
            </div>
            {listByGroup.length && (
              <ul className="">
                {listByGroup.map((item) => (
                  <li
                    key={item.group.id}
                    className="py-2 border-b border-thm-on-background-faint"
                  >
                    <Group group={item.group} list={item.list} />
                  </li>
                ))}
              </ul>
            )}
            {listUngrouped.length && (
              <ul className="mt-2">
                {listUngrouped.map((item) => (
                  <li
                    key={item.id}
                    className="border-b border-dashed border-thm-on-background-faint pb-2 mb-2 last:border-none last:mb-0 last:pb-0"
                  >
                    <Item endpoint={item} />
                  </li>
                ))}
              </ul>
            )}
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

type GroupProps = {
  group: EndpointGroup;
  list: Endpoint[];
};
const Group: React.FC<GroupProps> = ({ group, list }) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const handleToggleClick = useCallback<TextButtonProps['onClick']>(() => {
    setIsOpened((currVal) => !currVal);
  }, []);

  return (
    <div className="">
      {/* Head */}
      <div className="pl-2 flex items-center gap-2">
        <TextButton
          on={COLOR_SYSTEM.SURFACE}
          label={group.name}
          Icon={isOpened ? CollectionSolidIcon : CollectionOutlineIcon}
          onClick={handleToggleClick}
        />
        {group.description && (
          <div className="text-xxs text-thm-on-background-low">
            {group.description}
          </div>
        )}
      </div>
      {/* Body */}
      <div
        className={classnames('mt-2', {
          hidden: !isOpened,
        })}
      >
        {!!list.length ? (
          <ul>
            {list.map((item) => (
              <li
                key={item.id}
                className="border-b border-dashed border-thm-on-background-faint pb-2 mb-2 last:border-none last:mb-0 last:pb-0"
              >
                <Item endpoint={item} />
              </li>
            ))}
          </ul>
        ) : (
          <p>TODO: Empty</p>
        )}
      </div>
    </div>
  );
};
