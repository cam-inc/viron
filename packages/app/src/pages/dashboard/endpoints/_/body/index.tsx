import classnames from 'classnames';
import React, { useCallback, useState } from 'react';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import TextButton, {
  Props as TextButtonProps,
} from '~/components/button/text/on';
import Head from '~/components/head';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
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
            {!!listByGroup.length && (
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
            {!!listUngrouped.length && (
              <ul
                className="mt-2 p-2"
                style={{
                  display: 'grid',
                  gridGap: '8px',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                  gridAutoRows: 'auto',
                }}
              >
                {listUngrouped.map((item) => (
                  <li key={item.id} className="">
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
  const [isOpened, setIsOpened] = useState<boolean>(!!list.length);
  const handleToggleClick = useCallback<TextButtonProps['onClick']>(() => {
    if (!list.length) {
      return;
    }
    setIsOpened((currVal) => !currVal);
  }, [list]);

  return (
    <div className="border-l-2 border-thm-background hover:border-thm-on-background-low">
      {/* Head */}
      <div className="px-2 flex items-center gap-2">
        <TextButton
          on={COLOR_SYSTEM.SURFACE}
          label={`${group.name}(${list.length})`}
          Icon={isOpened ? ChevronDownIcon : ChevronRightIcon}
          onClick={handleToggleClick}
        />
        {group.description && (
          <div className="text-xxs text-thm-on-background-low truncate">
            {group.description}
          </div>
        )}
      </div>
      {/* Body */}
      <div
        className={classnames('mt-2 p-2', {
          hidden: !isOpened,
        })}
      >
        <ul
          className=""
          style={{
            display: 'grid',
            gridGap: '8px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gridAutoRows: 'auto',
          }}
        >
          {list.map((item) => (
            <li key={item.id} className="">
              <Item endpoint={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
