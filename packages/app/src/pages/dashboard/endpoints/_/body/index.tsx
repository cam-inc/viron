import classnames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Sortable from 'sortablejs';
import Button from '~/components/button';
import EndpointsEmptyIcon from '~/components/endpoinitsEmptyIcon';
import Head from '~/components/head';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import PlusIcon from '~/components/icon/plus/outline';
import { useEndpoint } from '~/hooks/endpoint';
import { Trans, useTranslation } from '~/hooks/i18n';
import { Props as LayoutProps } from '~/layouts/';
import Modal, { useModal } from '~/portals/modal';
import { COLOR_SYSTEM, Endpoint, EndpointGroup } from '~/types';
import Menu from '../../../_/menu';
import Add from './add/';
import Item from './item/';

export type Props = Parameters<LayoutProps['renderBody']>[0];
const Body: React.FC<Props> = ({ className, style }) => {
  const { t } = useTranslation();
  const { listByGroup, listUngrouped, setList } = useEndpoint();
  // Add modal.
  const modal = useModal();

  const sortable = useRef<Sortable | null>(null);
  const listUngroupedRef = React.useRef<HTMLUListElement>(null);

  const onSort = useCallback(() => {
    if (!sortable.current) {
      return;
    }
    const idArray = sortable.current.toArray();
    const newListUnGrouped = idArray.reduce((acc, id) => {
      const item = listUngrouped.find((item) => item.id === id);
      if (item) {
        acc.push(item);
      }
      return acc;
    }, [] as Endpoint[]);
    const listGrouped = listByGroup.flatMap(({ list }) => list);
    setList([...listGrouped, ...newListUnGrouped]);
  }, [listByGroup, listUngrouped, setList]);

  useEffect(() => {
    if (!listUngroupedRef.current) {
      return;
    }
    sortable.current = Sortable.create(listUngroupedRef.current, {
      animation: 300,
      easing: 'cubic-bezier(1, 0, 0, 1)',
      ghostClass: 'opacity-0',
      onSort,
    });
    return () => {
      if (sortable.current) {
        sortable.current.destroy();
      }
    };
  }, [onSort]);

  return (
    <>
      <div className={className} style={style}>
        <div className="max-w-[1252px] mx-auto @container px-4 lg:px-8">
          {/* Head */}
          <div>
            <div className="py-6 lg:py-10 flex justify-between items-center">
              <Head
                on={COLOR_SYSTEM.BACKGROUND}
                title={<div>{t('dashboard.endpoints.title')}</div>}
                description={t('dashboard.endpoints.description')}
              />
              <div className="flex items-center space-x-4">
                <Button
                  variant="outlined"
                  cs={COLOR_SYSTEM.PRIMARY}
                  label={t('addEndpointButtonLabel')}
                  Icon={PlusIcon}
                  onClick={modal.open}
                />
                <Menu />
              </div>
            </div>
          </div>
          {/* Body */}
          <div className="space-y-2">
            {!!listByGroup.length && (
              <ul>
                {listByGroup.map((item) => (
                  <li
                    key={item.group.id}
                    className="py-1 border-b border-thm-on-background-faint"
                  >
                    <Group group={item.group} list={item.list} />
                  </li>
                ))}
              </ul>
            )}
            {!!listUngrouped.length && (
              <ul
                ref={listUngroupedRef}
                id="list"
                className="grid grid-cols-1 @[740px]:grid-cols-2 @[995px]:grid-cols-3 gap-6 py-2"
              >
                {listUngrouped.map((item) => (
                  <li key={item.id} data-id={item.id}>
                    <Item endpoint={item} />
                  </li>
                ))}
              </ul>
            )}
            {!listByGroup.length && !listUngrouped.length && (
              <div className="flex flex-col justify-center items-center py-30 gap-6">
                <EndpointsEmptyIcon
                  className="w-[182px] text-thm-on-background-slight"
                  on={COLOR_SYSTEM.BACKGROUND}
                />
                <p className="text-center text-thm-on-background-low">
                  <Trans
                    t={t}
                    i18nKey="dashboard.endpoints.emptyMessage"
                    components={{
                      br: <br />,
                    }}
                  />
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal {...modal.bind}>
        <Add onAdd={modal.close} onCancel={modal.close} />
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
  const handleToggleClick = () => {
    setIsOpened((currVal) => !currVal);
  };

  const ToggleIcon = isOpened ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div>
      {/* Head */}
      <button
        className="flex gap-1 w-full hover:bg-thm-on-background-faint py-2 rounded"
        onClick={handleToggleClick}
      >
        <span className="p-0.5">
          <ToggleIcon className="w-4 h-4" />
        </span>
        <span className="text-start">
          <span className="block text-sm text-thm-on-background font-bold">
            {group.name}
          </span>
          {group.description && (
            <span className="block text-sm text-thm-on-background-low truncate">
              {group.description}
            </span>
          )}
        </span>
      </button>
      {/* Body */}

      <ul
        className={classnames(
          'grid grid-cols-1 @[740px]:grid-cols-2 @[995px]:grid-cols-3 gap-6 mt-2 py-2',
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
