import classnames from 'classnames';
import React, { useCallback, useState } from 'react';
import OutlineButton, {
  Props as OutlineButtonProps,
} from '~/components/button/outline';
import TextButton, {
  Props as TextButtonProps,
} from '~/components/button/text/on';
import Head from '~/components/head';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import PlusIcon from '~/components/icon/plus/outline';
import { useEndpoint } from '~/hooks/endpoint';
import { useTranslation } from '~/hooks/i18n';
import { Props as LayoutProps } from '~/layouts/';
import Modal, { useModal } from '~/portals/modal';
import { COLOR_SYSTEM, Endpoint, EndpointGroup } from '~/types';
import Tabs, { ITEM as TABS_ITEM } from '../../../_/tabs';
import Add, { Props as AddProps } from './add/';
import Item from './item/';

export type Props = Parameters<LayoutProps['renderBody']>[0];
const Body: React.FC<Props> = ({ className, style }) => {
  const { t } = useTranslation();
  const { listByGroup, listUngrouped } = useEndpoint();

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
        <div className="max-w-[1252px] mx-auto @container px-4 lg:px-8">
          {/* Head */}
          <div>
            <div className="py-6 pl-8">
              <Head
                on={COLOR_SYSTEM.BACKGROUND}
                title={<div>{t('dashboard.endpoints.title')}</div>}
                description={t('dashboard.endpoints.description')}
              />
            </div>
            <div>
              <Tabs item={TABS_ITEM.ENDPOINTS} />
            </div>
          </div>
          {/* Body */}
          <div>
            <div className="p-4 flex justify-end">
              <OutlineButton.renewal
                cs={COLOR_SYSTEM.PRIMARY}
                label={t('addEndpointButtonLabel')}
                Icon={PlusIcon}
                onClick={handleAddClick}
              />
            </div>
            {!!listByGroup.length && (
              <ul>
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
              <ul className="grid grid-cols-1 @[740px]:grid-cols-2 @[995px]:grid-cols-3 gap-6 mt-2 p-2">
                {listUngrouped.map((item) => (
                  <li key={item.id}>
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

      <ul
        className={classnames(
          'grid grid-cols-1 @[740px]:grid-cols-2 @[995px]:grid-cols-3 gap-6 mt-2 p-2',
          {
            hidden: !isOpened,
          }
        )}
      >
        {list.map((item) => (
          <li key={item.id}>
            <Item endpoint={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};
