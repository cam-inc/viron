import classnames from 'classnames';
import React, { useCallback, useState } from 'react';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import TextButton, { Props as TextButtonProps } from '~/components/button/text';
import Head from '~/components/head';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
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
              <Head on={COLOR_SYSTEM.BACKGROUND} title="Dashboard" />
            </div>
            <div>
              <Tabs item={TABS_ITEM.ENDPOINTS} />
            </div>
          </div>
          {/* Body */}
          <div className="">
            <div className="p-4 flex justify-end">
              <FilledButton
                cs={COLOR_SYSTEM.PRIMARY}
                label="Add an Endpoint"
                Icon={PlusCircleIcon}
                onClick={handleAddClick}
              />
            </div>
            {listByGroup.length && (
              <ul className="border-t border-b border-thm-on-background-faint">
                {listByGroup.map((item) => (
                  <li key={item.group.id}>
                    <Group group={item.group} list={item.list} />
                  </li>
                ))}
              </ul>
            )}
            {listUngrouped.length && (
              <ul className="">
                {listUngrouped.map((item) => (
                  <li
                    key={item.id}
                    className="p-2 hover:bg-thm-on-background-faint"
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
  const [isOpened, setIsOpened] = useState<boolean>(true);
  const handleToggleClick = useCallback<TextButtonProps['onClick']>(() => {
    setIsOpened((currVal) => !currVal);
  }, []);

  return (
    <div>
      {/* Head */}
      <div className="flex items-center gap-2">
        <div className="flex-none">
          <TextButton
            cs={COLOR_SYSTEM.PRIMARY}
            Icon={isOpened ? ChevronDownIcon : ChevronRightIcon}
            onClick={handleToggleClick}
          />
        </div>
        <div className="flex-1">
          <div>{group.name}</div>
        </div>
      </div>
      {/* Body */}
      <div>
        <ul
          className={classnames({
            hidden: !isOpened,
          })}
        >
          {list.map((item) => (
            <li key={item.id} className="p-2 hover:bg-thm-on-background-faint">
              <Item endpoint={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
